import { BeforeInsert, Column, Index } from "typeorm"
import { MedusaV2Flag } from "@medusajs/utils"

import { generateEntityId } from "../utils"
import { SoftDeletableEntity } from "../interfaces"
import { FeatureFlagEntity } from "../utils/feature-flag-decorators"

@FeatureFlagEntity([MedusaV2Flag.key, "sales_channels"])
export class OrderSalesChannel extends SoftDeletableEntity {
  @Index("order_sales_channel_order_id_unique", {
    unique: true,
  })
  @Column()
  order_id: string

  @Column()
  sales_channel_id: string

  /**
   * @apiIgnore
   */
  // NOTE: not working
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ordersc")
  }
}
