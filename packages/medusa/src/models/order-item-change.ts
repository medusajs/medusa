import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Unique,
} from "typeorm"

import { SoftDeletableEntity } from "../interfaces"
import { generateEntityId } from "../utils"
import { DbAwareColumn } from "../utils/db-aware-column"
import { LineItem } from "./line-item"
import { OrderEdit } from "./order-edit"

export enum OrderEditItemChangeType {
  ITEM_ADD = "item_add",
  ITEM_REMOVE = "item_remove",
  ITEM_UPDATE = "item_update",
}

@Unique(["order_edit_id", "original_line_item_id"])
@Unique(["order_edit_id", "line_item_id"])
@Entity()
export class OrderItemChange extends SoftDeletableEntity {
  @DbAwareColumn({
    type: "enum",
    enum: OrderEditItemChangeType,
  })
  type: OrderEditItemChangeType

  @Column()
  order_edit_id: string

  @ManyToOne(() => OrderEdit, (oe) => oe.changes)
  @JoinColumn({ name: "order_edit_id" })
  order_edit: OrderEdit

  @Column({ nullable: true })
  original_line_item_id?: string

  @ManyToOne(() => LineItem, { nullable: true })
  @JoinColumn({ name: "original_line_item_id" })
  original_line_item?: LineItem

  @Column({ nullable: true })
  line_item_id?: string

  @OneToOne(() => LineItem, { nullable: true })
  @JoinColumn({ name: "line_item_id" })
  line_item?: LineItem

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "oic")
  }
}

/**
 * @schema OrderItemChange
 * title: "Order Item Change"
 * description: "Represents an order edit item change"
 * type: object
 * required:
 *   - created_at
 *   - deleted_at
 *   - id
 *   - line_item_id
 *   - order_edit_id
 *   - original_line_item_id
 *   - type
 *   - updated_at
 * properties:
 *   id:
 *     description: The order item change's ID
 *     type: string
 *     example: oic_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   type:
 *     description: The order item change's status
 *     type: string
 *     enum:
 *       - item_add
 *       - item_remove
 *       - item_update
 *   order_edit_id:
 *     description: The ID of the order edit
 *     type: string
 *     example: oe_01G2SG30J8C85S4A5CHM2S1NS2
 *   order_edit:
 *     description: Available if the relation `order_edit` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/OrderEdit"
 *   original_line_item_id:
 *      description: The ID of the original line item in the order
 *      nullable: true
 *      type: string
 *      example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   original_line_item:
 *      description: Available if the relation `original_line_item` is expanded.
 *      nullable: true
 *      $ref: "#/components/schemas/LineItem"
 *   line_item_id:
 *      description: The ID of the cloned line item.
 *      nullable: true
 *      type: string
 *      example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   line_item:
 *      description: Available if the relation `line_item` is expanded.
 *      nullable: true
 *      $ref: "#/components/schemas/LineItem"
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 */
