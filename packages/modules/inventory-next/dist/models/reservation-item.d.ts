import { InventoryItem } from "./inventory-item";
export declare class ReservationItem {
    id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    line_item_id: string | null;
    location_id: string;
    quantity: number;
    external_id: string | null;
    description: string | null;
    created_by: string | null;
    metadata: Record<string, unknown> | null;
    inventory_item_id: string;
    inventory_item: InventoryItem;
    private beforeCreate;
    private onInit;
}
