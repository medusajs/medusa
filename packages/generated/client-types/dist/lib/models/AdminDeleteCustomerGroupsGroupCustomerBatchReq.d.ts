/**
 * The customers to remove from the customer group.
 */
export interface AdminDeleteCustomerGroupsGroupCustomerBatchReq {
    /**
     * The ids of the customers to remove
     */
    customer_ids: Array<{
        /**
         * ID of the customer
         */
        id: string;
    }>;
}
