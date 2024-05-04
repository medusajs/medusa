import { BigNumberRawValue } from "@medusajs/types";
import { BigNumber } from "@medusajs/utils";
import Payment from "./payment";
export default class Refund {
    id: string;
    amount: BigNumber | number;
    raw_amount: BigNumberRawValue;
    payment: Payment;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    created_by: string | null;
    metadata: Record<string, unknown> | null;
    onCreate(): void;
    onInit(): void;
}
