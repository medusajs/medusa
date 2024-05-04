export interface AdminGetNotesParams {
    /**
     * Limit the number of notes returned.
     */
    limit?: number;
    /**
     * The number of notes to skip when retrieving the notes.
     */
    offset?: number;
    /**
     * Filter by resource ID
     */
    resource_id?: string;
}
