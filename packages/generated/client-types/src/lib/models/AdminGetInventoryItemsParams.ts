/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetInventoryItemsParams {
  /**
   * How many inventory items to skip in the result.
   */
  offset?: number
  /**
   * Limit the number of inventory items returned.
   */
  limit?: number
  /**
   * Comma separated list of relations to include in the results.
   */
  expand?: string
  /**
   * Comma separated list of fields to include in the results.
   */
  fields?: string
  /**
   * Query used for searching product inventory items and their properties.
   */
  q?: string
  /**
   * Locations ids to search for.
   */
  location_id?: Array<string>
  /**
   * id to search for.
   */
  id?: string
  /**
   * sku to search for.
   */
  sku?: string
  /**
   * origin_country to search for.
   */
  origin_country?: string
  /**
   * mid_code to search for.
   */
  mid_code?: string
  /**
   * material to search for.
   */
  material?: string
  /**
   * hs_code to search for.
   */
  hs_code?: string
  /**
   * weight to search for.
   */
  weight?: string
  /**
   * length to search for.
   */
  length?: string
  /**
   * height to search for.
   */
  height?: string
  /**
   * width to search for.
   */
  width?: string
  /**
   * requires_shipping to search for.
   */
  requires_shipping?: string
}
