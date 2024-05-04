export interface AdminGetPaymentCollectionsParams {
    /**
     * Comma-separated relations that should be expanded in the returned payment collection.
     */
    expand?: string;
    /**
     * Comma-separated fields that should be included in the returned payment collection.
     */
    fields?: string;
}
