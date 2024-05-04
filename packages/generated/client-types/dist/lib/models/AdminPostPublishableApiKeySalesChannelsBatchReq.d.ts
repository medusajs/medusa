/**
 * The details of the sales channels to add to the publishable API key.
 */
export interface AdminPostPublishableApiKeySalesChannelsBatchReq {
    /**
     * The IDs of the sales channels to add to the publishable API key
     */
    sales_channel_ids: Array<{
        /**
         * The ID of the sales channel
         */
        id: string;
    }>;
}
