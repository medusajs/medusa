/**
 * This represents the association between the Publishable API keys and Sales Channels
 */
export interface PublishableApiKeySalesChannel {
    /**
     * The relation's ID
     */
    id?: string;
    /**
     * The sales channel's ID
     */
    sales_channel_id: string;
    /**
     * The publishable API key's ID
     */
    publishable_key_id: string;
    /**
     * The date with timezone at which the resource was created.
     */
    created_at: string;
    /**
     * The date with timezone at which the resource was updated.
     */
    updated_at: string;
    /**
     * The date with timezone at which the resource was deleted.
     */
    deleted_at: string | null;
}
