export default class PaymentMethodToken {
    id: string;
    provider_id: string;
    data: Record<string, unknown> | null;
    name: string;
    type_detail: string | null;
    description_detail: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    metadata: Record<string, unknown> | null;
    onCreate(): void;
    onInit(): void;
}
