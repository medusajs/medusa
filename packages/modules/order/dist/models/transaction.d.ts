import { BigNumberRawValue, DAL } from "@medusajs/types";
import { BigNumber } from "@medusajs/utils";
import { OptionalProps } from "@mikro-orm/core";
import Order from "./order";
type OptionalLineItemProps = DAL.EntityDateColumns;
export default class Transaction {
    [OptionalProps]?: OptionalLineItemProps;
    id: string;
    order_id: string;
    order: Order;
    amount: BigNumber | number;
    raw_amount: BigNumberRawValue;
    currency_code: string;
    reference: string | null;
    reference_id: string | null;
    created_at: Date;
    updated_at: Date;
    onCreate(): void;
    onInit(): void;
}
export {};
