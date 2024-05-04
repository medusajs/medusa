import type { Invite } from "./Invite";
/**
 * The list of invites.
 */
export interface AdminListInvitesRes {
    /**
     * An array of invites
     */
    invites: Array<Invite>;
}
