import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from "typeorm"

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
  fulfillment: Relation<Fulfillment>

  @ManyToOne(() => LineItem)
  @JoinColumn({ name: "item_id" })
  item: Relation<LineItem>

  @Column({ type: "int" })
  quantity: number
}

/**
 * @schema FulfillmentItem
 * title: "Fulfillment Item"
 * description: "This represents the association between a Line Item and a Fulfillment."
 * type: object
 * required:
 *   - fulfillment_id
 *   - item_id
 *   - quantity
 * properties:
 *   fulfillment_id:
 *     description: The ID of the Fulfillment that the Fulfillment Item belongs to.
 *     type: string
 *     example: ful_01G8ZRTMQCA76TXNAT81KPJZRF
 *   item_id:
 *     description: The ID of the Line Item that the Fulfillment Item references.
 *     type: string
 *     example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   fulfillment:
 *     description: The details of the fulfillment.
 *     x-expandable: "fulfillment"
 *     nullable: true
 *     $ref: "#/components/schemas/Fulfillment"
 *   item:
 *     description: The details of the line item.
 *     x-expandable: "item"
 *     nullable: true
 *     $ref: "#/components/schemas/LineItem"
 *   quantity:
 *     description: The quantity of the Line Item that is included in the Fulfillment.
 *     type: integer
 *     example: 1
 */
