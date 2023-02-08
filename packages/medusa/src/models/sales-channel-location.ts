import { BeforeInsert, Index, Column } from "typeorm"

import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
import { BaseEntity } from "../interfaces"
import { generateEntityId } from "../utils"

@FeatureFlagEntity("sales_channels")
export class SalesChannelLocation extends BaseEntity {
  @Index()
  @Column({ type: "text" })
  sales_channel_id: string

  @Index()
  @Column({ type: "text" })
  location_id: string

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "scloc")
  }
}

/**
 * @schema SalesChannelLocation
 * title: "Sales Channel Location"
 * description: "A Sales Channel Location"
 * type: object
 * required:
 *   - created_at
 *   - id
 *   - location_id
 *   - sales_channel_id
 *   - updated_at
 * properties:
 *  id:
 *    description: The sales channel location's ID
 *    type: string
 *    example: sc_01G8X9A7ESKAJXG2H0E6F1MW7A
 *  sales_channel_id:
 *    description: The sales channel's ID.
 *    type: string
 *    example: sc_01G8X9A7ESKAJXG2H0E6F1MW7A
 *  location_id:
 *    description: The location's ID.
 *    type: string
 *  created_at:
 *    description: The date with timezone at which the resource was created.
 *    type: string
 *    format: date-time
 *  updated_at:
 *    description: The date with timezone at which the resource was updated.
 *    type: string
 *    format: date-time
 */
