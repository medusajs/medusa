import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { LineItem } from "./line-item"
import { Return } from "./return"
import { ReturnReason } from "./return-reason"

@Entity()
export class ReturnItem {
  @PrimaryColumn()
  return_id: string

  @PrimaryColumn()
  item_id: string

  @ManyToOne(() => Return)
  @JoinColumn({ name: "return_id" })
  return_order: Relation<Return>

  @ManyToOne(() => LineItem)
  @JoinColumn({ name: "item_id" })
  item: Relation<LineItem>

  @Column({ type: "int" })
  quantity: number

  @Column({ type: "boolean", default: true })
  is_requested: boolean

  @Column({ type: "int", nullable: true })
  requested_quantity: number

  @Column({ type: "int", nullable: true })
  received_quantity: number

  @Column({ nullable: true })
  reason_id: string

  @ManyToOne(() => ReturnReason)
  @JoinColumn({ name: "reason_id" })
  reason: Relation<ReturnReason>

  @Column({ nullable: true })
  note: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>
}

/**
 * @schema ReturnItem
 * title: "Return Item"
 * description: "A return item represents a line item in an order that is to be returned. It includes details related to the return and the reason behind it."
 * type: object
 * required:
 *   - is_requested
 *   - item_id
 *   - metadata
 *   - note
 *   - quantity
 *   - reason_id
 *   - received_quantity
 *   - requested_quantity
 *   - return_id
 * properties:
 *   return_id:
 *     description: The ID of the Return that the Return Item belongs to.
 *     type: string
 *     example: ret_01F0YET7XPCMF8RZ0Y151NZV2V
 *   item_id:
 *     description: The ID of the Line Item that the Return Item references.
 *     type: string
 *     example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   return_order:
 *     description: Details of the Return that the Return Item belongs to.
 *     x-expandable: "return_order"
 *     nullable: true
 *     $ref: "#/components/schemas/Return"
 *   item:
 *     description: The details of the line item in the original order to be returned.
 *     x-expandable: "item"
 *     nullable: true
 *     $ref: "#/components/schemas/LineItem"
 *   quantity:
 *     description: The quantity of the Line Item to be returned.
 *     type: integer
 *     example: 1
 *   is_requested:
 *     description: Whether the Return Item was requested initially or received unexpectedly in the warehouse.
 *     type: boolean
 *     default: true
 *   requested_quantity:
 *     description: The quantity that was originally requested to be returned.
 *     nullable: true
 *     type: integer
 *     example: 1
 *   received_quantity:
 *     description: The quantity that was received in the warehouse.
 *     nullable: true
 *     type: integer
 *     example: 1
 *   reason_id:
 *     description: The ID of the reason for returning the item.
 *     nullable: true
 *     type: string
 *     example: rr_01G8X82GCCV2KSQHDBHSSAH5TQ
 *   reason:
 *     description: The details of the reason for returning the item.
 *     x-expandable: "reason"
 *     nullable: true
 *     $ref: "#/components/schemas/ReturnReason"
 *   note:
 *     description: An optional note with additional details about the Return.
 *     nullable: true
 *     type: string
 *     example: I didn't like it.
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
