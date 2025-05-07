import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Program } from "./program.entity";

@Entity({ name: "program_skills" })
export class ProgramSkill {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Program, (program) => program.skills, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "program_id" })
  program: Relation<Program>;

  @Column("uuid", { name: "program_id" })
  programId: string;

  @Column("uuid", { name: "skill_id" })
  skillId: string;
}
