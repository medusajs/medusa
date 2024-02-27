import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class ReturnReason extends SoftDeletableEntity {
  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column()
  value: string

  @Column()
  label: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  parent_return_reason_id: string | null

  @ManyToOne(() => ReturnReason, { cascade: ["soft-remove"] })
  @JoinColumn({ name: "parent_return_reason_id" })
  parent_return_reason: ReturnReason | null

  @OneToMany(
    () => ReturnReason,
    (return_reason) => return_reason.parent_return_reason,
    { cascade: ["insert", "soft-remove"] }
  )
  return_reason_children: ReturnReason[]

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "rr")
  }
}

/**
 * @schema ReturnReason
 * title: "Return Reason"
 * description: "A Return Reason is a value defined by an admin. It can be used on Return Items in order to indicate why a Line Item was returned."
 * type: object
 * required:
 *   - created_at
 *   - deleted_at
 *   - description
 *   - id
 *   - label
 *   - metadata
 *   - parent_return_reason_id
 *   - updated_at
 *   - value
 * properties:
 *   id:
 *     description: The return reason's ID
 *     type: string
 *     example: rr_01G8X82GCCV2KSQHDBHSSAH5TQ
 *   value:
 *     description: The value to identify the reason by.
 *     type: string
 *     example: damaged
 *   label:
 *     description: A text that can be displayed to the Customer as a reason.
 *     type: string
 *     example: Damaged goods
 *   description:
 *     description: A description of the Reason.
 *     nullable: true
 *     type: string
 *     example: Items that are damaged
 *   parent_return_reason_id:
 *     description: The ID of the parent reason.
 *     nullable: true
 *     type: string
 *     example: null
 *   parent_return_reason:
 *     description: The details of the parent reason.
 *     x-expandable: "parent_return_reason"
 *     nullable: true
 *     $ref: "#/components/schemas/ReturnReason"
 *   return_reason_children:
 *     description: The details of the child reasons.
 *     x-expandable: "return_reason_children"
 *     $ref: "#/components/schemas/ReturnReason"
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
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
