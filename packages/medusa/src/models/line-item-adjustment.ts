import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { Discount } from "./discount"
import { LineItem } from "./line-item"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
@Index(["discount_id", "item_id"], {
  unique: true,
  where: `"discount_id" IS NOT NULL`,
})
export class LineItemAdjustment {
  @PrimaryColumn()
  id: string

  @Index()
  @Column()
  item_id: string

  @ManyToOne(() => LineItem, (li) => li.adjustments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "item_id" })
  item: LineItem

  @Column()
  description: string

  @ManyToOne(() => Discount)
  @JoinColumn({ name: "discount_id" })
  discount: Discount

  @Index()
  @Column({ nullable: true })
  discount_id: string

  @Column({ type: "int" })
  amount: number

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "lia")
  }
}

/**
 * @schema line_item_adjustment
 * title: "Line Item Adjustment"
 * description: "Represents an Line Item Adjustment"
 * x-resourceId: line_item_adjustment
 * type: object
 * required:
 *   - item_id
 *   - description
 *   - amount
 * properties:
 *   id:
 *     type: string
 *     description: The invite's ID
 *     example: lia_01G8TKE4XYCTHSCK2GDEP47RE1
 *   item_id:
 *     type: string
 *     description: The ID of the line item
 *     example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   item:
 *     description: Available if the relation `item` is expanded.
 *     $ref: "#/components/schemas/line_item"
 *   description:
 *     type: string
 *     description: The line item's adjustment description
 *     example: Adjusted item's price.
 *   discount_id:
 *     type: string
 *     description: The ID of the discount associated with the adjustment
 *     example: disc_01F0YESMW10MGHWJKZSDDMN0VN
 *   discount:
 *     description: Available if the relation `discount` is expanded.
 *     $ref: "#/components/schemas/discount"
 *   amount:
 *     type: number
 *     description: The adjustment amount
 *     example: 1000
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
