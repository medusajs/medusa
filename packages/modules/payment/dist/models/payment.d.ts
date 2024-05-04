import { BigNumberRawValue, DAL } from "@medusajs/types";
import { BigNumber } from "@medusajs/utils";
import { Collection, OptionalProps } from "@mikro-orm/core";
import Capture from "./capture";
import PaymentCollection from "./payment-collection";
import PaymentSession from "./payment-session";
import Refund from "./refund";
type OptionalPaymentProps = DAL.EntityDateColumns;
export default class Payment {
    [OptionalProps]?: OptionalPaymentProps;
    id: string;
    amount: BigNumber | number;
    raw_amount: BigNumberRawValue;
    currency_code: string;
    provider_id: string;
    cart_id: string | null;
    order_id: string | null;
    customer_id: string | null;
    data: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    captured_at: Date | null;
    canceled_at: Date | null;
    refunds: Collection<Refund, object>;
    captures: Collection<Capture, object>;
    payment_collection: PaymentCollection;
    payment_collection_id: string;
    payment_session: PaymentSession;
    /** COMPUTED PROPERTIES START **/
    captured_amount: number;
    refunded_amount: number;
    /** COMPUTED PROPERTIES END **/
    onCreate(): void;
    onInit(): void;
}
export {};
