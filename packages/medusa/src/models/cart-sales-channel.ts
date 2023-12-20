import { BeforeInsert, Column, Index, PrimaryColumn } from "typeorm"
import { MedusaV2Flag, SalesChannelFeatureFlag } from "@medusajs/utils"

import { generateEntityId } from "../utils"
import { SoftDeletableEntity } from "../interfaces"
import { FeatureFlagEntity } from "../utils/feature-flag-decorators"

@FeatureFlagEntity([MedusaV2Flag.key, SalesChannelFeatureFlag.key])
export class CartSalesChannel extends SoftDeletableEntity {
  @Column()
  id: string

  @Index("cart_sales_channel_cart_id_unique", {
    unique: true,
  })
  @PrimaryColumn()
  cart_id: string

  @PrimaryColumn()
  sales_channel_id: string

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "cartsc")
  }
}
