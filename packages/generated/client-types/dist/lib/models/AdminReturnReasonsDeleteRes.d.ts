export interface AdminReturnReasonsDeleteRes {
    /**
     * The ID of the deleted return reason
     */
    id: string;
    /**
     * The type of the object that was deleted.
     */
    object: string;
    /**
     * Whether or not the items were deleted.
     */
    deleted: boolean;
}
