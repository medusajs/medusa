/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Region } from "./Region"

/**
 * Country details
 */
export interface Country {
  /**
   * The country's ID
   */
  id: string
  /**
   * The 2 character ISO code of the country in lower case
   */
  iso_2: string
  /**
   * The 2 character ISO code of the country in lower case
   */
  iso_3: string
  /**
   * The numerical ISO code for the country.
   */
  num_code: string
  /**
   * The normalized country name in upper case.
   */
  name: string
  /**
   * The country name appropriate for display.
   */
  display_name: string
  /**
   * The region ID this country is associated with.
   */
  region_id: string | null
  /**
   * A region object. Available if the relation `region` is expanded.
   */
  region?: Region | null
}
