import { BigNumber } from "@medusajs/utils";
import { BigNumberRawValue, DAL } from "@medusajs/types";
import { OptionalProps } from "@mikro-orm/core";
import Fulfillment from "./fulfillment";
type FulfillmentItemOptionalProps = DAL.SoftDeletableEntityDateColumns;
export default class FulfillmentItem {
    [OptionalProps]?: FulfillmentItemOptionalProps;
    id: string;
    title: string;
    sku: string;
    barcode: string;
    quantity: BigNumber | number;
    raw_quantity: BigNumberRawValue;
    line_item_id: string | null;
    inventory_item_id: string | null;
    fulfillment_id: string;
    fulfillment: Fulfillment;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
