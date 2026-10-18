export interface EmailPassAuthProviderOptions {
  hashConfig?: {
    logN: number
    r: number
    p: number
  }
  /**
   * Whether to only authenticate auth identities that are already associated
   * with an actor of the requested actor type (`app_metadata.{actor_type}_id`).
   * Registration isn't affected. When disabled, an auth identity can
   * authenticate as any actor type, for example to let an admin user
   * create a customer account with the same email.
   *
   * @defaultValue false
   */
  requireActorAssociation?: boolean
}
