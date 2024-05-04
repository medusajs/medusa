export interface AdminCollectionsDeleteRes {
    /**
     * The ID of the deleted Collection
     */
    id: string;
    /**
     * The type of the object that was deleted.
     */
    object: string;
    /**
     * Whether the collection was deleted successfully or not.
     */
    deleted: boolean;
}
