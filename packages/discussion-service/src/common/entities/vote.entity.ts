import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Post } from "./post.entity";
import { Comment } from "./comment.entity";

@Entity({ name: "votes" })
@Index(["userId", "post"], { unique: true })
@Index(["userId", "comment"], { unique: true })
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @ManyToOne(() => Post, (post) => post.votes, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "post_id" })
  post?: Post;

  @Column("uuid", { name: "post_id", nullable: true })
  postId?: string;

  @ManyToOne(() => Comment, (comment) => comment.votes, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "comment_id" })
  comment?: Comment;

  @Column("uuid", { name: "comment_id", nullable: true })
  commentId?: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
