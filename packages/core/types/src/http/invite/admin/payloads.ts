export type AdminAcceptInvite = {
  /**
   * The user's email.
   */
  email?: string | null
  /**
   * The user's first name.
   */
  first_name?: string | null
  /**
   * The user's last name.
   */
  last_name?: string | null
}

export type AdminCreateInvite = {
  /**
   * The email of the user to invite.
   */
  email: string
  /**
   * The RBAC roles to assign to the user when the invite is accepted. A role
   * can be constrained to one or more scopes, creating one role assignment per
   * scope.
   *
   * @featureFlag rbac
   */
  roles?:
    | {
        /**
         * The ID of the role to assign.
         */
        role_id: string
        /**
         * The scopes the role is constrained to, e.g.
         * `[{ type: "organization", id: "org_123" }]`.
         */
        scopes?: { type: string; id: string }[] | null
      }[]
    | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}
