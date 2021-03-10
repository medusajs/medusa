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

import { Return } from "./return"
import { LineItem } from "./line-item"

@Entity()
export class ReturnItem {
  @PrimaryColumn()
  return_id: string

  @PrimaryColumn()
  item_id: string

  @ManyToOne(() => Return)
  @JoinColumn({ name: "return_id" })
  return_order: Return

  @ManyToOne(() => LineItem)
  @JoinColumn({ name: "item_id" })
  item: LineItem

  @Column({ type: "int" })
  quantity: number

  @Column({ type: "boolean", default: true })
  is_requested: boolean

  @Column({ type: "int", nullable: true })
  requested_quantity: number

  @Column({ type: "int", nullable: true })
  received_quantity: number

  @Column({ type: "jsonb", nullable: true })
  metadata: any
}

/**
 * @schema return_item
 * title: "Return Item"
 * description: "Correlates a Line Item with a Return, keeping track of the quantity of the Line Item that will be returned."
 * x-resourceId: return_item
 * properties:
 *   return_id:
 *     description: "The id of the Return that the Return Item belongs to."
 *     type: string
 *   item_id:
 *     description: "The id of the Line Item that the Return Item references."
 *     type: string
 *   item:
 *     description: "The Line Item that the Return Item references."
 *     anyOf:
 *       - $ref: "#/components/schemas/line_item"
 *   quantity:
 *     description: "The quantity of the Line Item that is included in the Return."
 *     type: integer
 *   is_requested:
 *     description: "Whether the Return Item was requested initially or received unexpectedly in the warehouse."
 *     type: boolean
 *   requested_quantity:
 *     description: "The quantity that was originally requested to be returned."
 *     type: integer
 *   recieved_quantity:
 *     description: "The quantity that was received in the warehouse."
 *     type: integer
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */
