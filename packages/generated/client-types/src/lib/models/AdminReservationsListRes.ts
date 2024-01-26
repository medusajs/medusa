/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ExtendedReservationItem } from "./ExtendedReservationItem"

/**
 * The list of reservations with pagination fields.
 */
export interface AdminReservationsListRes {
  /**
   * An array of reservations details.
   */
  reservations: Array<ExtendedReservationItem>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of reservations skipped when retrieving the reservations.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
