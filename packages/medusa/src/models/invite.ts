import { BeforeInsert, Column, CreateDateColumn, Entity, Index } from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"
import { UserRoles } from "./user"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class Invite extends SoftDeletableEntity {
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

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "invite")
  }
}

/**
 * @schema invite
 * title: "Invite"
 * description: "Represents an invite"
 * x-resourceId: invite
 * properties:
 *   id:
 *     type: string
 *   user_email:
 *     type: string
 *   role:
 *     type: string
 *     enum:
 *       - admin
 *       - member
 *       - developer
 *   accepted:
 *     type: boolean
 *   token:
 *     type: string
 *   expores_at:
 *     type: string
 *     format: date-time
 *   created_at:
 *     type: string
 *     format: date-time
 *   updated_at:
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     format: date-time
 *   metadata:
 *     type: object
 */

