/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ReservationItemDTO } from "./ReservationItemDTO"

/**
 * The reservation's details.
 */
export interface AdminReservationsRes {
  /**
   * Reservation details.
   */
  reservation: ReservationItemDTO
}
