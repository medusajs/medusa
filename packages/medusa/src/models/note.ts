import {
  Entity,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
  PrimaryColumn,
  ManyToOne,
} from "typeorm"
import { ulid } from "ulid"
import { User } from "./user"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

@Entity()
export class Note {
  @PrimaryColumn()
  id: string

  @Column()
  value: string

  @Index()
  @Column()
  resource_type: string

  @Index()
  @Column()
  resource_id: string

  @Column({ nullable: true })
  author_id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "author_id" })
  author: User

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `note_${id}`
  }
}

/**
 * @schema note
 * title: "Note"
 * description: "Notes are elements which we can use in association with different resources to allow users to describe additional information in relation to these."
 * x-resourceId: note
 * properties:
 *   id:
 *     description: "The id of the Note. This value will be prefixed by `note_`."
 *     type: string
 *   resource_type:
 *     description: "The type of resource that the Note refers to."
 *     type: string
 *   resource_id:
 *     description: "The id of the resource that the Note refers to."
 *     type: string
 *   value:
 *     description: "The contents of the note."
 *     type: string
 *   author:
 *     description: "The author of the note."
 *     anyOf:
 *       - $ref: "#/components/schemas/user"
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: "The date with timezone at which the resource was deleted."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */
