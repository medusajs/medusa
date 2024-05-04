export interface AdminNotesDeleteRes {
    /**
     * The ID of the deleted Note.
     */
    id: string;
    /**
     * The type of the object that was deleted.
     */
    object: string;
    /**
     * Whether or not the Note was deleted.
     */
    deleted: boolean;
}
