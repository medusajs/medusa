/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PublishableApiKey } from "./PublishableApiKey"

/**
 * The list of publishable API keys with pagination fields.
 */
export interface AdminPublishableApiKeysListRes {
  /**
   * An array of publishable API keys details.
   */
  publishable_api_keys: Array<PublishableApiKey>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of publishable API keys skipped when retrieving the publishable API keys.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
