/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The list of fulfillment options in a region.
 */
export interface AdminGetRegionsRegionFulfillmentOptionsRes {
  /**
   * Fulfillment providers details.
   */
  fulfillment_options: Array<{
    /**
     * ID of the fulfillment provider
     */
    provider_id: string
    /**
     * fulfillment provider options
     */
    options: Array<Record<string, any>>
  }>
}
