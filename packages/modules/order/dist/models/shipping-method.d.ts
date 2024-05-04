import { BigNumberRawValue } from "@medusajs/types";
import { BigNumber } from "@medusajs/utils";
import { Collection } from "@mikro-orm/core";
import ShippingMethodAdjustment from "./shipping-method-adjustment";
import ShippingMethodTaxLine from "./shipping-method-tax-line";
export default class ShippingMethod {
    id: string;
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
    onCreate(): void;
    onInit(): void;
}
