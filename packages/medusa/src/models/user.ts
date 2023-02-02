import { BeforeInsert, Column, Entity, Index } from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

export enum UserRoles {
  ADMIN = "admin",
  MEMBER = "member",
  DEVELOPER = "developer",
}

@Entity()
export class User extends SoftDeletableEntity {
  @DbAwareColumn({
    type: "enum",
    enum: UserRoles,
    nullable: true,
    default: UserRoles.MEMBER,
  })
  role: UserRoles

  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column()
  email: string

  @Column({ nullable: true })
  first_name: string | null

  @Column({ nullable: true })
  last_name: string | null

  @Column({ nullable: true, select: false })
  password_hash?: string | null

  @Column({ nullable: true })
  api_token: string | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "usr")
  }
}

/**
 * @schema User
 * title: "User"
 * description: "Represents a User who can manage store settings."
 * type: object
 * required:
 *   - email
 * properties:
 *   id:
 *     type: string
 *     description: The user's ID
 *     example: usr_01G1G5V26F5TB3GPAPNJ8X1S3V
 *   email:
 *     description: "The email of the User"
 *     type: string
 *     format: email
 *   first_name:
 *     description: "The first name of the User"
 *     type: string
 *     example: Levi
 *   last_name:
 *     description: "The last name of the User"
 *     type: string
 *     example: Bogan
 *   api_token:
 *     description: An API token associated with the user.
 *     type: string
 *     example: null
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
