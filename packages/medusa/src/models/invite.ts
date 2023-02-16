import { BeforeInsert, Column, CreateDateColumn, Entity, Index } from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { UserRoles } from "./user"
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
 * @schema Invite
 * title: "Invite"
 * description: "Represents an invite"
 * type: object
 * required:
 *   - accepted
 *   - created_at
 *   - deleted_at
 *   - expires_at
 *   - id
 *   - metadata
 *   - role
 *   - token
 *   - updated_at
 *   - user_email
 * properties:
 *   id:
 *     type: string
 *     description: The invite's ID
 *     example: invite_01G8TKE4XYCTHSCK2GDEP47RE1
 *   user_email:
 *     description: The email of the user being invited.
 *     type: string
 *     format: email
 *   role:
 *     description: The user's role.
 *     nullable: true
 *     type: string
 *     enum:
 *       - admin
 *       - member
 *       - developer
 *     default: member
 *   accepted:
 *     description: Whether the invite was accepted or not.
 *     type: boolean
 *     default: false
 *   token:
 *     description: The token used to accept the invite.
 *     type: string
 *   expires_at:
 *     description: The date the invite expires at.
 *     type: string
 *     format: date-time
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 */
