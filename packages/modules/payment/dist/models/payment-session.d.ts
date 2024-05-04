import { BigNumberRawValue } from "@medusajs/types";
import { BigNumber, PaymentSessionStatus } from "@medusajs/utils";
import { OptionalProps } from "@mikro-orm/core";
import Payment from "./payment";
import PaymentCollection from "./payment-collection";
export default class PaymentSession {
    [OptionalProps]?: "status" | "data";
    id: string;
    currency_code: string;
    amount: BigNumber | number;
    raw_amount: BigNumberRawValue;
    provider_id: string;
    data: Record<string, unknown>;
    context: Record<string, unknown> | null;
    status: PaymentSessionStatus;
    authorized_at: Date | null;
    payment_collection: PaymentCollection;
    payment_collection_id: string;
    payment?: Payment | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
