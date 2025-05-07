import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "src/common/entities/post.entity";
import { IsNull, Repository } from "typeorm";
import { AuthContext } from "src/auth/auth-context.type";
import { Comment } from "src/common/entities/comment.entity";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { ClientProxy } from "@nestjs/microservices";
import { SEARCH_SERVICE } from "src/clients/clients.constants";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @Inject(SEARCH_SERVICE) private readonly rmqClient: ClientProxy,
  ) {}

  async getComments(postId: string) {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException("Post not found.");
    }

    const comments = await this.commentRepository.find({
      where: {
        postId,
        replyTo: IsNull(),
      },
      order: { createdAt: "desc" },
    });

    return comments;
  }

  async getReplies(commentId: string) {
    const parentComment = await this.commentRepository.findOneBy({
      id: commentId,
    });

    if (!parentComment) {
      throw new NotFoundException("Comment not found.");
    }

    const replies = await this.commentRepository.find({
      where: { replyToId: commentId },
      order: { createdAt: "desc" },
    });

    return replies;
  }

  async createComment(postId: string, dto: CreateCommentDto, ctx: AuthContext) {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException("Post not found.");
    }

    const comment = this.commentRepository.create({
      postId,
      content: dto.content,
      userId: ctx.user.id,
      // TODO: remove
      createdAt: new Date(dto.createdAt),
    });

    const savedComment = await this.commentRepository.save(comment);

    await this.postRepository.increment({ id: postId }, "commentsCount", 1);

    this.rmqClient.emit("discussion.created", {
      id: savedComment.id,
      type: "comment",
      content: savedComment.content,
      postId: savedComment.postId,
      upvotesCount: 0,
      commentsCount: 0,
      createdAt: savedComment.createdAt,
    });

    this.rmqClient.emit("discussion.updated", {
      id: postId,
      commentsCount: post.commentsCount + 1,
    });

    return savedComment;
  }

  async createReply(
    commentId: string,
    dto: CreateCommentDto,
    ctx: AuthContext,
  ) {
    const parent = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ["post"],
    });

    if (!parent) {
      throw new NotFoundException("Post not found.");
    }

    if (parent.replyTo) {
      throw new BadRequestException("Cannot reply to a reply.");
    }

    const reply = this.commentRepository.create({
      post: parent.post,
      replyTo: parent,
      content: dto.content,
      userId: ctx.user.id,
    });

    const savedReply = await this.commentRepository.save(reply);

    await this.commentRepository.increment(
      { id: commentId },
      "repliesCount",
      1,
    );

    this.rmqClient.emit("discussion.created", {
      id: savedReply.id,
      type: "reply",
      content: savedReply.content,
      postId: savedReply.postId,
      upvotesCount: 0,
      commentsCount: 0,
      createdAt: savedReply.createdAt,
    });

    this.rmqClient.emit("discussion.updated", {
      id: commentId,
      commentsCount: parent.repliesCount + 1,
    });

    return savedReply;
  }
}
