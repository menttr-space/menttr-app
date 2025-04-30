import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./category.entity";
import { ProgramStatus } from "../enums/program-status.enum";
import { ProgramType } from "../enums/program-type.enum";
import { ProgramParticipant } from "./program-participant.entity";

@Entity({ name: "programs" })
export class Program {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", { name: "owner_id" })
  ownerId: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: "enum", enum: ProgramType })
  type: ProgramType;

  @Column({ length: 600, nullable: true })
  description: string;

  @Column({ name: "start_date", type: "timestamptz" })
  startDate: Date;

  @Column({ name: "end_date", type: "timestamptz", nullable: true }) // can be null for recurring programs
  endDate: Date;

  @Column({ name: "max_participants" })
  maxParticipants: number;

  @Column({ name: "active_participants", default: 0 })
  activeParticipants: number;

  @Column({
    type: "enum",
    enum: ProgramStatus,
    default: ProgramStatus.Enrollment,
  })
  status: ProgramStatus;

  @OneToMany(() => ProgramParticipant, (pp) => pp.program)
  participants: ProgramParticipant[];

  @Column({ name: "meeting_link", length: 200, nullable: true })
  meetingLink: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  @ManyToMany(() => Category, (category) => category.programs)
  @JoinTable({
    name: "programs_categories",
    joinColumn: { name: "program_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "category_id", referencedColumnName: "id" },
  })
  categories: Category[];
}
