/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PublishableApiKey } from "./PublishableApiKey"

export interface AdminPublishableApiKeysRes {
  /**
   * Publishable API key details.
   */
  publishable_api_key: PublishableApiKey
}
