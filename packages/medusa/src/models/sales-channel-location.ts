import { BeforeInsert, Index, Column, ManyToOne, JoinColumn } from "typeorm"

import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
import { SoftDeletableEntity } from "../interfaces"
import { generateEntityId } from "../utils"
import { SalesChannel } from "./sales-channel"

@FeatureFlagEntity("sales_channels")
export class SalesChannelLocation extends SoftDeletableEntity {
  @Index()
  @Column({ type: "text" })
  sales_channel_id: string

  @Index()
  @Column({ type: "text" })
  location_id: string

  @ManyToOne(() => SalesChannel, (sc) => sc.locations)
  @JoinColumn({ name: "sales_channel_id" })
  sales_channel: SalesChannel

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "scloc")
  }
}

/**
 * @schema SalesChannelLocation
 * title: "Sales Channel Stock Location"
 * description: "Sales Channel Stock Location link sales channels with stock locations."
 * type: object
 * properties:
 *   id:
 *     type: string
 *     description: The Sales Channel Stock Location's ID
 *     example: scloc_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   sales_channel_id:
 *     description: "The id of the Sales Channel"
 *     type: string
 *   location_id:
 *     description: "The id of the Location Stock."
 *     type: string
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 */
