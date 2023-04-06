import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm"

import { DbAwareColumn, generateEntityId } from "../utils"
import { Discount } from "./discount"
import { LineItem } from "./line-item"

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

  @Column({ type: "numeric", transformer: { to: (value) => value, from: (value) => parseFloat(value) } })
  amount: number

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "lia")
  }
}

/**
 * @schema LineItemAdjustment
 * title: "Line Item Adjustment"
 * description: "Represents a Line Item Adjustment"
 * type: object
 * required:
 *   - amount
 *   - description
 *   - discount_id
 *   - id
 *   - item_id
 *   - metadata
 * properties:
 *   id:
 *     description: The Line Item Adjustment's ID
 *     type: string
 *     example: lia_01G8TKE4XYCTHSCK2GDEP47RE1
 *   item_id:
 *     description: The ID of the line item
 *     type: string
 *     example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   item:
 *     description: Available if the relation `item` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/LineItem"
 *   description:
 *     description: The line item's adjustment description
 *     type: string
 *     example: Adjusted item's price.
 *   discount_id:
 *     description: The ID of the discount associated with the adjustment
 *     nullable: true
 *     type: string
 *     example: disc_01F0YESMW10MGHWJKZSDDMN0VN
 *   discount:
 *     description: Available if the relation `discount` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Discount"
 *   amount:
 *     description: The adjustment amount
 *     type: number
 *     example: 1000
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 */
