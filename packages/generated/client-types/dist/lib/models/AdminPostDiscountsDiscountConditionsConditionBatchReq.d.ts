/**
 * The details of the resources to add.
 */
export interface AdminPostDiscountsDiscountConditionsConditionBatchReq {
    /**
     * The resources to be added to the discount condition
     */
    resources: Array<{
        /**
         * The ID of the item
         */
        id: string;
    }>;
}
