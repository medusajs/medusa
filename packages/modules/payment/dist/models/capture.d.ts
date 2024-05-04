import { BigNumberRawValue } from "@medusajs/types";
import { BigNumber } from "@medusajs/utils";
import { OptionalProps } from "@mikro-orm/core";
import Payment from "./payment";
type OptionalCaptureProps = "created_at";
export default class Capture {
    [OptionalProps]?: OptionalCaptureProps;
    id: string;
    amount: BigNumber | number;
    raw_amount: BigNumberRawValue;
    payment: Payment;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    created_by: string | null;
    onCreate(): void;
    onInit(): void;
}
export {};
