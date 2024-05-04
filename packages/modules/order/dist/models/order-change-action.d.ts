import { BigNumberRawValue, DAL } from "@medusajs/types";
import { BigNumber } from "@medusajs/utils";
import { OptionalProps } from "@mikro-orm/core";
import Order from "./order";
import OrderChange from "./order-change";
type OptionalLineItemProps = DAL.EntityDateColumns;
export default class OrderChangeAction {
    [OptionalProps]?: OptionalLineItemProps;
    id: string;
    ordering: number;
    order_id: string | null;
    order: Order | null;
    version: number | null;
    order_change_id: string | null;
    order_change: OrderChange | null;
    reference: string | null;
    reference_id: string | null;
    action: string;
    details: Record<string, unknown>;
    amount: BigNumber | number | null;
    raw_amount: BigNumberRawValue | null;
    internal_note: string | null;
    applied: boolean;
    created_at: Date;
    updated_at: Date;
    onCreate(): void;
    onInit(): void;
}
export {};
