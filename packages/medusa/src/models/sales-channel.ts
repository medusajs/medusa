import { BeforeInsert, Column, OneToMany } from "typeorm"

import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
import { SoftDeletableEntity } from "../interfaces"
import { generateEntityId } from "../utils"
import { SalesChannelLocation } from "./sales-channel-location"

@FeatureFlagEntity("sales_channels")
export class SalesChannel extends SoftDeletableEntity {
  @Column()
  name: string

  @Column({ type: "varchar", nullable: true })
  description: string | null

  @Column({ default: false })
  is_disabled: boolean

  @OneToMany(
    () => SalesChannelLocation,
    (scLocation) => scLocation.sales_channel,
    {
      cascade: ["soft-remove", "remove"],
    }
  )
  locations: SalesChannelLocation[]

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "sc")
  }
}

/**
 * @schema SalesChannel
 * title: "Sales Channel"
 * description: "A Sales Channel"
 * type: object
 * required:
 *   - created_at
 *   - deleted_at
 *   - description
 *   - id
 *   - is_disabled
 *   - name
 *   - updated_at
 * properties:
 *  id:
 *    description: The sales channel's ID
 *    type: string
 *    example: sc_01G8X9A7ESKAJXG2H0E6F1MW7A
 *  name:
 *    description: The name of the sales channel.
 *    type: string
 *    example: Market
 *  description:
 *    description: The description of the sales channel.
 *    nullable: true
 *    type: string
 *    example: Multi-vendor market
 *  is_disabled:
 *    description: Specify if the sales channel is enabled or disabled.
 *    type: boolean
 *    default: false
 *  locations:
 *    description: The Stock Locations related to the sales channel. Available if the relation `locations` is expanded.
 *    type: array
 *    items:
 *      $ref: "#/components/schemas/SalesChannelLocation"
 *  created_at:
 *    description: The date with timezone at which the resource was created.
 *    type: string
 *    format: date-time
 *  updated_at:
 *    description: The date with timezone at which the resource was updated.
 *    type: string
 *    format: date-time
 *  deleted_at:
 *    description: The date with timezone at which the resource was deleted.
 *    nullable: true
 *    type: string
 *    format: date-time
 */
