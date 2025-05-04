import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./comment.entity";
import { Vote } from "./vote.entity";

@Entity({ name: "posts" })
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @Column()
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ name: "upvotes_count", default: 0 })
  upvotesCount: number;

  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  // Total comments (top-level + replies)
  @Column({ name: "comments_count", default: 0 })
  commentsCount: number;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
