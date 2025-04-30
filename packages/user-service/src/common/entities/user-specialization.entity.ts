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

@Entity({ name: "user_specializations" })
export class UserSpecialization {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.specializations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: Relation<User>;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @Column("uuid", { name: "specialization_id" })
  specializationId: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
