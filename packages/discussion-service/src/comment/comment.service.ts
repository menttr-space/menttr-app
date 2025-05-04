import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "src/common/entities/post.entity";
import { IsNull, Repository } from "typeorm";
import { AuthContext } from "src/auth/auth-context.type";
import { Comment } from "src/common/entities/comment.entity";
import { CreateCommentDto } from "./dtos/create-comment.dto";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
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
    });

    const savedComment = await this.commentRepository.save(comment);

    await this.postRepository.increment({ id: postId }, "commentsCount", 1);

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
      { id: parent.id },
      "repliesCount",
      1,
    );
    await this.postRepository.increment(
      { id: parent.post.id },
      "commentsCount",
      1,
    );

    return savedReply;
  }
}
