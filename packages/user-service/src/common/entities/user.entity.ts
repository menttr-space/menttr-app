import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Role } from "../enums/role.enum";
import { UserToken } from "./user-token.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 20 })
  username: string;

  // Security

  @Column({ name: "password_hash" })
  passwordHash: string;

  @Column({ enum: Role, default: Role.Mentee })
  role: Role;

  // Account information

  @Column({ name: "display_name", length: 50, nullable: true })
  displayName: string;

  @Column({ name: "profile_image_url", nullable: true })
  profileImageUrl: string;

  @Column({ length: 600, nullable: true })
  bio: string;

  @Column({ length: 2, nullable: true })
  country: string; // ISO 3166-1 alpha-2 code

  @Column({ length: 100, nullable: true })
  company: string;

  @Column({ name: "job_title", length: 100, nullable: true })
  jobTitle: string;

  @Column({ name: "social_link", length: 100, nullable: true })
  socialLink: string;

  @Column({ name: "mentor_applied_at", type: "timestamptz", nullable: true })
  mentorAppliedAt: Date;

  @Column({ name: "mentor_approved_at", type: "timestamptz", nullable: true })
  mentorApprovedAt: Date;

  @Column({ name: "mentor_rejected_at", type: "timestamptz", nullable: true })
  mentorRejectedAt: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  @OneToMany(() => UserToken, (userToken) => userToken.user)
  userTokens: UserToken[];
}
