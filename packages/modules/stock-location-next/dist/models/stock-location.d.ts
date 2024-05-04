import { StockLocationAddress } from "./stock-location-address";
export declare class StockLocation {
    id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    name: string;
    address_id: string | null;
    address: StockLocationAddress | null;
    metadata: Record<string, unknown> | null;
    private beforeCreate;
    private onInit;
}
