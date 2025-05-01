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
import { User } from "./user.entity";

@Entity({ name: "user_skills" })
export class UserSkill {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.skills, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: Relation<User>;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @Column("uuid", { name: "skill_id" })
  skillId: string;
}
