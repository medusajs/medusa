import {
  BeforeInsert,
  Column,
  Index,
  JoinColumn,
  ManyToOne,
  Relation,
} from "typeorm"

import { SoftDeletableEntity } from "../interfaces"
import { generateEntityId } from "../utils"
import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
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
  sales_channel: Relation<SalesChannel>

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "scloc")
  }
}

/**
 * @schema SalesChannelLocation
 * title: "Sales Channel Stock Location"
 * description: "This represents the association between a sales channel and a stock locations."
 * type: object
 * required:
 *   - created_at
 *   - deleted_at
 *   - id
 *   - location_id
 *   - sales_channel_id
 *   - updated_at
 * properties:
 *   id:
 *     description: The Sales Channel Stock Location's ID
 *     type: string
 *     example: scloc_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   sales_channel_id:
 *     description: "The ID of the Sales Channel"
 *     type: string
 *     example: sc_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   location_id:
 *     description: "The ID of the Location Stock."
 *     type: string
 *   sales_channel:
 *     description: The details of the sales channel the location is associated with.
 *     x-expandable: "sales_channel"
 *     nullable: true
 *     $ref: "#/components/schemas/SalesChannel"
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was updated."
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: "The date with timezone at which the resource was deleted."
 *     nullable: true
 *     type: string
 *     format: date-time
 */
