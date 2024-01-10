import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm"
import { BaseEntity } from "../interfaces"
import { generateEntityId } from "../utils"

@Entity("publishable_api_key_sales_channel")
export class PublishableApiKeySalesChannel extends BaseEntity {
  @Column({ type: "text" })
  id: string

  @PrimaryColumn({ type: "text" })
  sales_channel_id: string

  @PrimaryColumn({ type: "text" })
  publishable_key_id: string

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pksc")
  }
}

/**
 * @schema PublishableApiKeySalesChannel
 * title: "Publishable API Key Sales Channel"
 * description: "This represents the association between the Publishable API keys and Sales Channels"
 * type: object
 * required:
 *   - publishable_key_id
 *   - sales_channel_id
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *    description: The relation's ID
 *    type: string
 *    example: pksc_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   sales_channel_id:
 *     description: The sales channel's ID
 *     type: string
 *     example: sc_01G1G5V21KADXNGH29BJMAJ4B4
 *   publishable_key_id:
 *     description: The publishable API key's ID
 *     type: string
 *     example: pak_01G1G5V21KADXNGH29BJMAJ4B4
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 */
