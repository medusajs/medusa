export interface AdminInviteDeleteRes {
    /**
     * The ID of the deleted Invite.
     */
    id: string;
    /**
     * The type of the object that was deleted.
     */
    object: string;
    /**
     * Whether or not the invite was deleted.
     */
    deleted: boolean;
}
