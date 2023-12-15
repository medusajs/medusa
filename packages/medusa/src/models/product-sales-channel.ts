import { BeforeInsert, Column, Entity } from "typeorm"
import { BaseEntity } from "../interfaces"
import { generateEntityId } from "../utils"

@Entity("product_sales_channel")
export class ProductSalesChannel extends BaseEntity {
  @Column({ type: "text" })
  sales_channel_id: string

  @Column({ type: "text" })
  product_id: string

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "prodsc")
  }
}
