import { BigNumberRawValue, DAL } from "@medusajs/types";
import { BigNumber } from "@medusajs/utils";
import { Collection, OptionalProps } from "@mikro-orm/core";
import Cart from "./cart";
import ShippingMethodAdjustment from "./shipping-method-adjustment";
import ShippingMethodTaxLine from "./shipping-method-tax-line";
type OptionalShippingMethodProps = "cart" | "is_tax_inclusive" | DAL.SoftDeletableEntityDateColumns;
export default class ShippingMethod {
    [OptionalProps]?: OptionalShippingMethodProps;
    id: string;
    cart_id: string;
    cart: Cart;
    name: string;
    description: string | null;
    amount: BigNumber | number;
    raw_amount: BigNumberRawValue;
    is_tax_inclusive: boolean;
    shipping_option_id: string | null;
    data: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;
    tax_lines: Collection<ShippingMethodTaxLine, object>;
    adjustments: Collection<ShippingMethodAdjustment, object>;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
