import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class ReturnReason extends SoftDeletableEntity {
  @Index({ unique: true })
  @Column()
  value: string

  @Column()
  label: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  parent_return_reason_id: string

  @ManyToOne(() => ReturnReason, { cascade: ["soft-remove"] })
  @JoinColumn({ name: "parent_return_reason_id" })
  parent_return_reason: ReturnReason

  @OneToMany(
    () => ReturnReason,
    (return_reason) => return_reason.parent_return_reason,
    { cascade: ["insert", "soft-remove"] }
  )
  return_reason_children: ReturnReason[]

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "rr")
  }
}

/**
 * @schema return_reason
 * title: "Return Reason"
 * description: "A Reason for why a given product is returned. A Return Reason can be used on Return Items in order to indicate why a Line Item was returned."
 * x-resourceId: return_reason
 * properties:
 *   id:
 *     description: "The id of the Return Reason will start with `rr_`."
 *     type: string
 *   description:
 *     description: "A description of the Reason."
 *     type: string
 *   label:
 *     description: "A text that can be displayed to the Customer as a reason."
 *     type: string
 *   value:
 *     description: "The value to identify the reason by."
 *     type: string
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
