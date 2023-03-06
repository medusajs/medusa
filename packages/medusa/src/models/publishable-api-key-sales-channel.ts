import { PrimaryColumn } from "typeorm"

import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
import PublishableAPIKeysFeatureFlag from "../loaders/feature-flags/publishable-api-keys"

@FeatureFlagEntity(PublishableAPIKeysFeatureFlag.key)
export class PublishableApiKeySalesChannel {
  @PrimaryColumn()
  sales_channel_id: string

  @PrimaryColumn()
  publishable_key_id: string
}

/**
 * @schema PublishableApiKeySalesChannel
 * title: "Publishable API key sales channel"
 * description: "Holds mapping between Publishable API keys and Sales Channels"
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
