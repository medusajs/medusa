import { BigNumberRawValue, DAL } from "@medusajs/types";
import { BigNumber, PaymentCollectionStatus } from "@medusajs/utils";
import { Collection, OptionalProps } from "@mikro-orm/core";
import Payment from "./payment";
import PaymentProvider from "./payment-provider";
import PaymentSession from "./payment-session";
type OptionalPaymentCollectionProps = "status" | DAL.EntityDateColumns;
export default class PaymentCollection {
    [OptionalProps]?: OptionalPaymentCollectionProps;
    id: string;
    currency_code: string;
    amount: BigNumber | number;
    raw_amount: BigNumberRawValue;
    region_id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    completed_at: Date | null;
    status: PaymentCollectionStatus;
    payment_providers: Collection<PaymentProvider, object>;
    payment_sessions: Collection<PaymentSession, object>;
    payments: Collection<Payment, object>;
    metadata: Record<string, unknown> | null;
    onCreate(): void;
    onInit(): void;
}
export {};
