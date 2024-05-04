import { BigNumberRawValue } from "@medusajs/types";
import { BigNumber } from "@medusajs/utils";
declare class Currency {
    code: string;
    symbol: string;
    symbol_native: string;
    name: string;
    decimal_digits: number;
    rounding: BigNumber | number;
    raw_rounding: BigNumberRawValue;
    created_at: Date;
    updated_at: Date;
}
export default Currency;
