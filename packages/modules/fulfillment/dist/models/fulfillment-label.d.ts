import { DAL } from "@medusajs/types";
import { OptionalProps } from "@mikro-orm/core";
import Fulfillment from "./fulfillment";
type FulfillmentLabelOptionalProps = DAL.SoftDeletableEntityDateColumns;
export default class FulfillmentLabel {
    [OptionalProps]?: FulfillmentLabelOptionalProps;
    id: string;
    tracking_number: string;
    tracking_url: string;
    label_url: string;
    fulfillment_id: string;
    fulfillment: Fulfillment;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
