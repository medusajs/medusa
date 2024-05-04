export interface AdminGetOrdersOrderParams {
    /**
     * Comma-separated relations that should be expanded in the returned order.
     */
    expand?: string;
    /**
     * Comma-separated fields that should be included in the returned order.
     */
    fields?: string;
}
