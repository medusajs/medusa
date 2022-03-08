import {
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryColumn,
} from "typeorm"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

export class TaxLine {
  @PrimaryColumn()
  id: string

  @Column({ type: "real" })
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
