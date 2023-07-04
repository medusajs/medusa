import { BaseEntity } from "../interfaces/models/base-entity"
import { Column } from "typeorm"
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
 * @schema TaxLine
 * title: "Tax Line"
 * description: "Line item that specifies an amount of tax to add to a line item."
 * type: object
 * required:
 *   - code
 *   - created_at
 *   - id
 *   - metadata
 *   - name
 *   - rate
 *   - updated_at
 * properties:
 *   id:
 *     description: The tax line's ID
 *     type: string
 *     example: tl_01G1G5V2DRX1SK6NQQ8VVX4HQ8
 *   code:
 *     description: A code to identify the tax type by
 *     nullable: true
 *     type: string
 *     example: tax01
 *   name:
 *     description: A human friendly name for the tax
 *     type: string
 *     example: Tax Example
 *   rate:
 *     description: The numeric rate to charge tax by
 *     type: number
 *     example: 10
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 */
