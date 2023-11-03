import { Column, Entity } from "typeorm"
import { BaseEntity } from "../interfaces"

@Entity("cart_sales_channel")
export class CartSalesChannel extends BaseEntity {
  @Column({ type: "text" })
  sales_channel_id: string

  @Column({ type: "text" })
  cart_id: string
}
