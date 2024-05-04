import ShippingMethod from "./shipping-method";
import TaxLine from "./tax-line";
export default class ShippingMethodTaxLine extends TaxLine {
    shipping_method: ShippingMethod;
    shipping_method_id: string;
    tax_rate_id: string | null;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
