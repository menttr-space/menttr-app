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

@Entity({ name: "program_specializations" })
export class ProgramSpecialization {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Program, (program) => program.specializations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "program_id" })
  program: Relation<Program>;

  @Column("uuid", { name: "program_id" })
  programId: string;

  @Column("uuid", { name: "specialization_id" })
  specializationId: string;
}
