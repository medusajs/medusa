/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface GetPublishableApiKeysParams {
  /**
   * term to search publishable API keys' titles.
   */
  q?: string
  /**
   * Limit the number of publishable API keys returned.
   */
  limit?: number
  /**
   * The number of publishable API keys to skip when retrieving the publishable API keys.
   */
  offset?: number
  /**
   * Comma-separated relations that should be expanded in the returned publishable API keys.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned publishable API keys.
   */
  fields?: string
}
