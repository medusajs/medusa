import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
  Index,
} from "typeorm"
import { BaseEntity } from "./_base"
import { ulid } from "ulid"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"
import { UserRoles } from "./user"

@Entity()
export class Invite extends BaseEntity {
  prefixId = "invite"

  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column()
  user_email: string

  @DbAwareColumn({
    type: "enum",
    enum: UserRoles,
    nullable: true,
    default: UserRoles.MEMBER,
  })
  role: UserRoles

  @Column({ default: false })
  accepted: boolean

  @Column()
  token: string

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  expires_at: Date
}
