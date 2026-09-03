/**
 * @schema AdminUserResetPasswordTokenResponse
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminUserResetPasswordTokenResponse
 * required:
 *   - token
 * properties:
 *   token:
 *     type: string
 *     title: token
 *     description: |-
 *       The generated reset password token. Append it to the admin's
 *       `/reset-password` page as a `token` query parameter to build a link the
 *       user can open to set a new password.
 * 
 *       The token is short-lived, can only be used once, and generating it
 *       invalidates any reset password token previously issued for the user.
 * 
*/

