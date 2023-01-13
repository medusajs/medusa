import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { User } from "./user"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class Note extends SoftDeletableEntity {
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

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "note")
  }
}

/**
 * @schema Note
 * title: "Note"
 * description: "Notes are elements which we can use in association with different resources to allow users to describe additional information in relation to these."
 * type: object
 * required:
 *   - value
 *   - resource_type
 *   - resource_id
 * properties:
 *   id:
 *     type: string
 *     description: The note's ID
 *     example: note_01G8TM8ENBMC7R90XRR1G6H26Q
 *   resource_type:
 *     description: "The type of resource that the Note refers to."
 *     type: string
 *     example: order
 *   resource_id:
 *     description: "The ID of the resource that the Note refers to."
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   value:
 *     description: "The contents of the note."
 *     type: string
 *     example: This order must be fulfilled on Monday
 *   author_id:
 *     type: string
 *     description: The ID of the author (user)
 *     example: usr_01G1G5V26F5TB3GPAPNJ8X1S3V
 *   author:
 *     description: Available if the relation `author` is expanded.
 *     $ref: "#/components/schemas/User"
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
