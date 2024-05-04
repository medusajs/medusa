export interface AdminOrdersOrderLineItemReservationReq {
    /**
     * The ID of the location of the reservation
     */
    location_id: string;
    /**
     * The quantity to reserve
     */
    quantity?: number;
}
