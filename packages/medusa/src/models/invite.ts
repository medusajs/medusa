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
import { ulid } from "ulid"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"
import { UserRoles } from "./user"

@Entity()
export class Invite {
  @PrimaryColumn()
  id: string

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

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert(): void {
    if (this.id) {
      return
    }
    const id = ulid()
    this.id = `invite_${id}`
  }
}
