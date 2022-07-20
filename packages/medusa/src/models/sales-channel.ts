import { BeforeInsert, Column } from "typeorm"

import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
import { SoftDeletableEntity } from "../interfaces"
import { generateEntityId } from "../utils"

@FeatureFlagEntity("sales_channels")
export class SalesChannel extends SoftDeletableEntity {
  @Column()
  name: string

  @Column({ type: "varchar", nullable: true })
  description: string | null

  @Column({ default: false })
  is_disabled: boolean

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "sc")
  }
}

/**
 * @schema sales_channel
 * title: "Sales Channel"
 * description: "A Sales Channel"
 * x-resourceId: sales_channel
 * properties:
 *  id:
 *    description: "The unique identifier for the sales channel."
 *    type: string
 *  name:
 *    description: "The name of the sales channel."
 *    type: string
 *  description:
 *    description: "The description of the sales channel."
 *    type: string
 *  is_disabled:
 *    description: "Specify if the sales channel is enabled or disabled."
 *    type: boolean
 *    default: false
 *  created_at:
 *    description: "The date with timezone at which the resource was created."
 *    type: string
 *    format: date-time
 *  updated_at:
 *    description: "The date with timezone at which the resource was last updated."
 *    type: string
 *    format: date-time
 *  deleted_at:
 *    description: "The date with timezone at which the resource was deleted."
 *    type: string
 *    format: date-time
 */