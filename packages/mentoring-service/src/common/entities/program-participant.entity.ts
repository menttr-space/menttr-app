import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Program } from "./program.entity";
import { ProgramParticipantStatus } from "../enums/program-participant-status.enum";

@Entity({ name: "program_participants" })
export class ProgramParticipant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", { name: "program_id" })
  programId: string;

  @ManyToOne(() => Program, (program) => program.participants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "program_id" })
  program: Relation<Program>;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @Column({ name: "application_message", length: 600 })
  applicationMessage: string;

  @Column({
    type: "enum",
    enum: ProgramParticipantStatus,
    default: ProgramParticipantStatus.Pending,
  })
  status: ProgramParticipantStatus;

  @Column({ name: "rejection_reason", length: 100, nullable: true })
  rejectionReason: string;

  @Column({ name: "registered_at", type: "timestamptz", nullable: true })
  registeredAt: Date;

  @Column({ name: "rejected_at", type: "timestamptz", nullable: true })
  rejectedAt: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
