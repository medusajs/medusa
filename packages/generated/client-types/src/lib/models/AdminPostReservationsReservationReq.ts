/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details to update of the reservation.
 */
export interface AdminPostReservationsReservationReq {
  /**
   * The ID of the location associated with the reservation.
   */
  location_id?: string
  /**
   * The quantity to reserve.
   */
  quantity?: number
  /**
   * The reservation's description.
   */
  description?: string
  /**
   * An optional set of key-value pairs with additional information.
   */
  metadata?: Record<string, any>
}
