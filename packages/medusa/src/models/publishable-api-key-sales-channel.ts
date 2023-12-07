import { BeforeInsert, Column, Entity } from "typeorm"
import { BaseEntity } from "../interfaces"
import { generateEntityId } from "../utils"

@Entity("publishable_api_key_sales_channel")
export class PublishableApiKeySalesChannel extends BaseEntity {
  @Column({ type: "text" })
  sales_channel_id: string

  @Column({ type: "text" })
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
 * properties:
 *   sales_channel_id:
 *     description: The sales channel's ID
 *     type: string
 *     example: sc_01G1G5V21KADXNGH29BJMAJ4B4
 *   publishable_key_id:
 *     description: The publishable API key's ID
 *     type: string
 *     example: pak_01G1G5V21KADXNGH29BJMAJ4B4
 */
