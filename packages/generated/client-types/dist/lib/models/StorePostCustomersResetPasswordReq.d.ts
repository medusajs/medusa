export interface StorePostCustomersResetPasswordReq {
    /**
     * The customer's email.
     */
    email: string;
    /**
     * The customer's password.
     */
    password: string;
    /**
     * The reset password token
     */
    token: string;
}
