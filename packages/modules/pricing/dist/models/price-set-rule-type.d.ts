export default class PriceSetRuleType {
    id: string;
    price_set_id: string;
    rule_type_id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
