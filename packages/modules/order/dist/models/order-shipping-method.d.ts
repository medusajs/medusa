import { DAL } from "@medusajs/types";
import { OptionalProps } from "@mikro-orm/core";
import Order from "./order";
import ShippingMethod from "./shipping-method";
type OptionalShippingMethodProps = DAL.EntityDateColumns;
export default class OrderShippingMethod {
    [OptionalProps]?: OptionalShippingMethodProps;
    id: string;
    order_id: string;
    version: number;
    order: Order;
    shipping_method_id: string;
    shipping_method: ShippingMethod;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
