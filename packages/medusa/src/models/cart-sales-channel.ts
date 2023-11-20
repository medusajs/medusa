import { BeforeInsert, Column, Entity, Index } from "typeorm"

import { generateEntityId } from "../utils"
import { SoftDeletableEntity } from "../interfaces"

@Entity()
export class CartSalesChannel extends SoftDeletableEntity {
  @Index("cart_sales_channel_cart_id_unique", {
    unique: true,
  })
  @Column()
  cart_id: string

  @Column()
  sales_channel_id: string

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    console.log("!!!!! CALLING BEFORE INSERT")
    this.id = generateEntityId(this.id, "cartsc")
  }
}
