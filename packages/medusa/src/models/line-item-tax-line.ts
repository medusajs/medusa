import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from "typeorm"

import { LineItem } from "./line-item"
import { TaxLine } from "./tax-line"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
@Unique(["item_id", "code"])
export class LineItemTaxLine extends TaxLine {
  @Index()
  @Column()
  item_id: string

  @ManyToOne(() => LineItem, (li) => li.tax_lines)
  @JoinColumn({ name: "item_id" })
  item: LineItem

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "litl")
  }
}

/**
 * @schema LineItemTaxLine
 * title: "Line Item Tax Line"
 * description: "Represents a Line Item Tax Line"
 * type: object
 * required:
 *   - code
 *   - created_at
 *   - id
 *   - item_id
 *   - metadata
 *   - name
 *   - rate
 *   - updated_at
 * properties:
 *   id:
 *     description: The line item tax line's ID
 *     type: string
 *     example: litl_01G1G5V2DRX1SK6NQQ8VVX4HQ8
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
 *   item_id:
 *     description: The ID of the line item
 *     type: string
 *     example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   item:
 *     description: Available if the relation `item` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/LineItem"
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
