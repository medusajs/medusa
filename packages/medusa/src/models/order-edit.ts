import { BeforeInsert, JoinColumn, ManyToOne, OneToMany } from "typeorm"

import { SoftDeletableEntity } from "../interfaces"
import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
import { generateEntityId } from "../utils"
import { OrderItemChange } from "./order-item-change"
import { Order } from "./order"

@FeatureFlagEntity("order_editing")
export class OrderEdit extends SoftDeletableEntity {
  @ManyToOne(() => Order, (o) => o.edits)
  @JoinColumn({ name: "order_id" })
  order: Order

  @OneToMany(() => OrderItemChange, (oic) => oic.order_edit, {
    eager: true,
    cascade: true,
  })
  changes: OrderItemChange[]

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "oe")
  }
}
