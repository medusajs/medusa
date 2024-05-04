export interface AdminUpdateUserRequest {
    /**
     * The first name of the User.
     */
    first_name?: string;
    /**
     * The last name of the User.
     */
    last_name?: string;
    /**
     * The role assigned to the user. These roles don't provide any different privileges.
     */
    role?: "admin" | "member" | "developer";
    /**
     * The API token of the User.
     */
    api_token?: string;
    /**
     * An optional set of key-value pairs with additional information.
     */
    metadata?: Record<string, any>;
}
