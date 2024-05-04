import type { InventoryItemDTO } from "./InventoryItemDTO";
import type { LineItem } from "./LineItem";
import type { ReservationItemDTO } from "./ReservationItemDTO";
export type ExtendedReservationItem = ReservationItemDTO & {
    /**
     * The line item associated with the reservation.
     */
    line_item?: LineItem;
    /**
     * The inventory item associated with the reservation.
     */
    inventory_item?: InventoryItemDTO;
};
