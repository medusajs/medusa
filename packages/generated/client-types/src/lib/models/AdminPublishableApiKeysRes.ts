/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PublishableApiKey } from "./PublishableApiKey"

/**
 * The publishable API key's details.
 */
export interface AdminPublishableApiKeysRes {
  /**
   * Publishable API key details.
   */
  publishable_api_key: PublishableApiKey
}
