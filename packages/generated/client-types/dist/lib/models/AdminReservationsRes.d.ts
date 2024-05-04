import type { ReservationItemDTO } from "./ReservationItemDTO";
/**
 * The reservation's details.
 */
export interface AdminReservationsRes {
    /**
     * Reservation details.
     */
    reservation: ReservationItemDTO;
}
