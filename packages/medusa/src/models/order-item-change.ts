import { BeforeInsert, Column, JoinColumn, ManyToOne, OneToOne } from "typeorm"

import { SoftDeletableEntity } from "../interfaces"
import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
import { generateEntityId } from "../utils"
import { DbAwareColumn } from "../utils/db-aware-column"
import { OrderEdit } from "./order-edit"
import { LineItem } from "./line-item"

export enum OrderEditItemChangeType {
  ITEM_ADD = "item_add",
  ITEM_REMOVE = "item_remove",
  QUANTITY_CHANGE = "quantity_change",
}

@FeatureFlagEntity("order_editing")
export class OrderItemChange extends SoftDeletableEntity {
  @DbAwareColumn({
    type: "enum",
    nullable: true,
    enum: OrderEditItemChangeType,
  })
  type: OrderEditItemChangeType

  @Column()
  order_edit_id: string

  @ManyToOne(() => OrderEdit, (oe) => oe.changes)
  @JoinColumn({ name: "order_edit_id" })
  order_edit: OrderEdit

  @Column({ nullable: true })
  original_line_item_id: string

  @OneToOne(() => LineItem, { nullable: true })
  @JoinColumn({ name: "original_line_item_id" })
  original_line_item: LineItem

  @Column({ nullable: true })
  line_item_id: string

  @OneToOne(() => LineItem, { nullable: true })
  @JoinColumn({ name: "line_item_id" })
  line_item: LineItem

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "oec")
  }
}
