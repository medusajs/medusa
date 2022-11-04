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
