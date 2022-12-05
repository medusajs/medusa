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
 * @schema invite
 * title: "Invite"
 * description: "Represents an invite"
 * x-resourceId: invite
 * type: object
 * required:
 *   - user_email
 * properties:
 *   id:
 *     type: string
 *     description: The invite's ID
 *     example: invite_01G8TKE4XYCTHSCK2GDEP47RE1
 *   user_email:
 *     type: string
 *     description: The email of the user being invited.
 *     format: email
 *   role:
 *     type: string
 *     description: The user's role.
 *     enum:
 *       - admin
 *       - member
 *       - developer
 *     default: member
 *   accepted:
 *     type: boolean
 *     description: Whether the invite was accepted or not.
 *     example: false
 *   token:
 *     type: string
 *     description: The token used to accept the invite.
 *   expores_at:
 *     type: string
 *     description: The date the invite expires at.
 *     format: date-time
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
