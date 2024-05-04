/**
 * The details of the customer group to create.
 */
export interface AdminPostCustomerGroupsReq {
    /**
     * Name of the customer group
     */
    name: string;
    /**
     * Metadata of the customer group.
     */
    metadata?: Record<string, any>;
}
