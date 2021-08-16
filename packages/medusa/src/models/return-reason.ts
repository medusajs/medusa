import {
  Entity,
  Index,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm"
import { ulid } from "ulid"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

@Entity()
export class ReturnReason {
  @PrimaryColumn()
  id: string

  @Index({ unique: true })
  @Column()
  value: string

  @Column()
  label: string

  @Column({ nullable: true })
  description: string

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
    this.id = `rr_${id}`
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
