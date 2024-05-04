import { Collection, OptionalProps } from "@mikro-orm/core";
import PriceSet from "./price-set";
type OptionalFields = "default_priority";
declare class RuleType {
    [OptionalProps]?: OptionalFields;
    id: string;
    name: string;
    rule_attribute: string;
    default_priority: number;
    price_sets: Collection<PriceSet, object>;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export default RuleType;
