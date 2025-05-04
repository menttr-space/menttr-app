import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "src/common/entities/post.entity";
import { Repository } from "typeorm";
import { AuthContext } from "src/auth/auth-context.type";
import { Vote } from "src/common/entities/vote.entity";
import { Comment } from "src/common/entities/comment.entity";

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>,
  ) {}

  async addPostVote(postId: string, ctx: AuthContext) {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException("Post not found.");
    }

    const existingVote = await this.voteRepository.findOne({
      where: {
        userId: ctx.user.id,
        postId,
      },
    });

    if (!existingVote) {
      const vote = this.voteRepository.create({ userId: ctx.user.id, post });
      await this.voteRepository.save(vote);
      await this.postRepository.increment({ id: postId }, "upvotesCount", 1);
    }

    return { ok: true };
  }

  async removePostVote(postId: string, ctx: AuthContext) {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException("Post not found.");
    }

    const existingVote = await this.voteRepository.findOne({
      where: {
        userId: ctx.user.id,
        postId,
      },
    });

    if (existingVote) {
      await this.voteRepository.remove(existingVote);
      if (post.upvotesCount > 0) {
        await this.postRepository.decrement({ id: postId }, "upvotesCount", 1);
      }
    }

    return { ok: true };
  }

  async addCommentVote(commentId: string, ctx: AuthContext) {
    const comment = await this.commentRepository.findOneBy({ id: commentId });
    if (!comment) {
      throw new NotFoundException("Comment not found.");
    }

    const existingVote = await this.voteRepository.findOne({
      where: {
        userId: ctx.user.id,
        commentId,
      },
    });

    if (!existingVote) {
      const vote = this.voteRepository.create({ userId: ctx.user.id, comment });
      await this.voteRepository.save(vote);
      await this.commentRepository.increment(
        { id: commentId },
        "upvotesCount",
        1,
      );
    }

    return { ok: true };
  }

  async removeCommentVote(commentId: string, ctx: AuthContext) {
    const comment = await this.commentRepository.findOneBy({ id: commentId });
    if (!comment) {
      throw new NotFoundException("Comment not found.");
    }

    const existingVote = await this.voteRepository.findOne({
      where: {
        userId: ctx.user.id,
        commentId,
      },
    });

    if (existingVote) {
      await this.voteRepository.remove(existingVote);
      if (comment.upvotesCount > 0) {
        await this.commentRepository.decrement(
          { id: commentId },
          "upvotesCount",
          1,
        );
      }
    }

    return { ok: true };
  }
}
