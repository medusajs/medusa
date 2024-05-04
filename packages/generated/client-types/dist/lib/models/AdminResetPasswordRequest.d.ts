/**
 * The details of the password reset request.
 */
export interface AdminResetPasswordRequest {
    /**
     * The User's email.
     */
    email?: string;
    /**
     * The password-reset token generated when the password reset was requested.
     */
    token: string;
    /**
     * The User's new password.
     */
    password: string;
}
