import { Column, Entity } from "typeorm"
import { BaseEntity } from "../interfaces"

@Entity("product_sales_channel")
export class ProductSalesChannel extends BaseEntity {
  @Column({ type: "text" })
  sales_channel_id: string

  @Column({ type: "text" })
  product_id: string
}
