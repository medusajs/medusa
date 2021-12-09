import {
  Entity,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  Index,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

import { LineItem } from "./line-item"

@Entity()
export class TaxLine {
  @PrimaryColumn()
  id: string

  @Index()
  @Column()
  item_id: string

  @ManyToOne(() => LineItem, (li) => li.tax_lines)
  @JoinColumn({ name: "item_id" })
  item: LineItem

  @Column()
  rate: number

  @Column()
  name: string

  @Column({ type: "varchar", nullable: true })
  code: string | null

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `tl_${id}`
  }
}

/**
 * @schema tax_line
 * title: "Tax Line"
 * description: "Line item that specifies an amount of tax to add to a line item."
 * x-resourceId: tax_line
 * properties:
 *   id:
 *     description: "The id of the Tax Line. This value will be prefixed by `tl_`."
 *     type: string
 *   code:
 *     description: "A code to identify the tax type by"
 *     type: string
 *   name:
 *     description: "A human friendly name for the tax"
 *     type: string
 *   rate:
 *     description: "The numeric rate to charge tax by"
 *     type: number
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */
