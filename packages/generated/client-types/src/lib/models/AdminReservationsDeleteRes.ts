/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminReservationsDeleteRes {
  /**
   * The ID of the deleted Reservation.
   */
  id: string
  /**
   * The type of the object that was deleted.
   */
  object: string
  /**
   * Whether or not the Reservation was deleted.
   */
  deleted: boolean
}
