import { InventoryItem } from "./inventory-item";
export declare class InventoryLevel {
    id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    inventory_item_id: string;
    location_id: string;
    stocked_quantity: number;
    reserved_quantity: number;
    incoming_quantity: number;
    metadata: Record<string, unknown> | null;
    inventory_item: InventoryItem;
    available_quantity: number | null;
    private beforeCreate;
    private onInit;
    private onLoad;
}
