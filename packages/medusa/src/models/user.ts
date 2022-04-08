import {
  Entity,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  Column,
  PrimaryColumn,
} from "typeorm"
import { BaseEntity } from "./_base"
import { ulid } from "ulid"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

export enum UserRoles {
  ADMIN = "admin",
  MEMBER = "member",
  DEVELOPER = "developer",
}

@Entity()
export class User extends BaseEntity {
  prefixId = "usr"

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
  first_name: string

  @Column({ nullable: true })
  last_name: string

  @Column({ nullable: true, select: false })
  password_hash: string

  @Column({ nullable: true })
  api_token: string
}

/**
 * @schema user
 * title: "User"
 * description: "Represents a User who can manage store settings."
 * x-resourceId: user
 * properties:
 *   id:
 *     description: "The unique id of the User. This will be prefixed with `usr_`"
 *     type: string
 *   email:
 *     description: "The email of the User"
 *     type: string
 *   first_name:
 *     type: string
 *   last_name:
 *     description: "The Customer's billing address."
 *     anyOf:
 *       - $ref: "#/components/schemas/address"
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
