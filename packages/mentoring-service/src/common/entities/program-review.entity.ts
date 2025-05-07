import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Program } from "./program.entity";

@Entity("program_reviews")
export class ProgramReview {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 600 })
  content: string;

  @Column({ type: "smallint", nullable: true })
  rating: number;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @ManyToOne(() => Program, (program) => program.reviews)
  @JoinColumn({ name: "program_id" })
  program: Relation<Program>;

  @Column("uuid", { name: "program_id" })
  programId: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
