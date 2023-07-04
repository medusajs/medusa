/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminOrdersOrderLineItemReservationReq {
  /**
   * The id of the location of the reservation
   */
  location_id: string
  /**
   * The quantity to reserve
   */
  quantity?: number
}
