import AdjustmentLine from "./adjustment-line";
import ShippingMethod from "./shipping-method";
export default class ShippingMethodAdjustment extends AdjustmentLine {
    shipping_method: ShippingMethod;
    shipping_method_id: string;
    onCreate(): void;
    onInit(): void;
}
