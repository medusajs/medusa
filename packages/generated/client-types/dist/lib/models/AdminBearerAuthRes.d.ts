/**
 * The access token of the user, if they're authenticated successfully.
 */
export interface AdminBearerAuthRes {
    /**
     * Access token that can be used to send authenticated requests.
     */
    access_token?: string;
}
