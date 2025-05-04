import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./post.entity";
import { Vote } from "./vote.entity";

@Entity({ name: "comments" })
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  content: string;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id" })
  post: Post;

  @Column("uuid", { name: "post_id" })
  postId: string;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "reply_to_id" })
  replyTo?: Comment;

  @Column("uuid", { name: "reply_to_id", nullable: true })
  replyToId?: string;

  @Column({ name: "upvotes_count", default: 0 })
  upvotesCount: number;

  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];

  // Only for top-level comments
  @Column({ name: "replies_count", default: 0 })
  repliesCount: number;

  @OneToMany(() => Comment, (comment) => comment.replyTo)
  replies: Comment[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
