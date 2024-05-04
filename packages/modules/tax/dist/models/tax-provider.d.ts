import { OptionalProps } from "@mikro-orm/core";
export default class TaxProvider {
    [OptionalProps]?: "is_enabled";
    id: string;
    is_enabled: boolean;
}
