import { OptionalProps } from "@mikro-orm/core";
export default class PaymentProvider {
    [OptionalProps]?: "is_enabled";
    id: string;
    is_enabled: boolean;
}
