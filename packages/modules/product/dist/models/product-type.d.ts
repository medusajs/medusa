declare class ProductType {
    id: string;
    value: string;
    metadata?: Record<string, unknown> | null;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    onInit(): void;
}
export default ProductType;
