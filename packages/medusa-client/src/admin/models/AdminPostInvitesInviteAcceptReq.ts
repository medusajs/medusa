/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminPostInvitesInviteAcceptReq = {
  /**
   * The invite token provided by the admin.
   */
  token: string;
  /**
   * The User to create.
   */
  user: {
    /**
     * the first name of the User
     */
    first_name: string;
    /**
     * the last name of the User
     */
    last_name: string;
    /**
     * The desired password for the User
     */
    password: string;
  };
};

