import { Column } from "typeorm"
import { BaseEntity } from "../interfaces/models/base-entity"
import { DbAwareColumn } from "../utils/db-aware-column"

export class TaxLine extends BaseEntity {
  @Column({ type: "real" })
  rate: number

  @Column()
  name: string

  @Column({ type: "varchar", nullable: true })
  code: string | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>
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
