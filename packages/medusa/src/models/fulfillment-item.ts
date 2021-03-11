import {
  Entity,
  Generated,
  RelationId,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
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
  fulfillment: Fulfillment

  @ManyToOne(() => LineItem)
  @JoinColumn({ name: "item_id" })
  item: LineItem

  @Column({ type: "int" })
  quantity: number
}

/**
 * @schema fulfillment_item
 * title: "Fulfillment Item"
 * description: "Correlates a Line Item with a Fulfillment, keeping track of the quantity of the Line Item."
 * x-resourceId: fulfillment_item
 * properties:
 *   fulfillment_id:
 *     description: "The id of the Fulfillment that the Fulfillment Item belongs to."
 *     type: string
 *   item_id:
 *     description: "The id of the Line Item that the Fulfillment Item references."
 *     type: string
 *   item:
 *     description: "The Line Item that the Fulfillment Item references."
 *     anyOf:
 *       - $ref: "#/components/schemas/line_item"
 *   quantity:
 *     description: "The quantity of the Line Item that is included in the Fulfillment."
 *     type: integer
 */
