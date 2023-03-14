import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"

import { Fulfillment } from "./fulfillment"
import { LineItem } from "./line-item"

@Entity()
export class FulfillmentItem {
  @PrimaryColumn()
  fulfillment_id: string

  @PrimaryColumn()
  item_id: string

  @ManyToOne(() => Fulfillment)
  @JoinColumn({ name: "fulfillment_id" })
  fulfillment: Fulfillment

  @ManyToOne(() => LineItem)
  @JoinColumn({ name: "item_id" })
  item: LineItem

  @Column({ type: "int" })
  quantity: number
}

/**
 * @schema FulfillmentItem
 * title: "Fulfillment Item"
 * description: "Correlates a Line Item with a Fulfillment, keeping track of the quantity of the Line Item."
 * type: object
 * required:
 *   - fulfillment_id
 *   - item_id
 *   - quantity
 * properties:
 *   fulfillment_id:
 *     description: The id of the Fulfillment that the Fulfillment Item belongs to.
 *     type: string
 *     example: ful_01G8ZRTMQCA76TXNAT81KPJZRF
 *   item_id:
 *     description: The id of the Line Item that the Fulfillment Item references.
 *     type: string
 *     example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   fulfillment:
 *     description: A fulfillment object. Available if the relation `fulfillment` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Fulfillment"
 *   item:
 *     description: Available if the relation `item` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/LineItem"
 *   quantity:
 *     description: The quantity of the Line Item that is included in the Fulfillment.
 *     type: integer
 *     example: 1
 */
