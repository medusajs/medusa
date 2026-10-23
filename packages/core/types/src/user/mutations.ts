import { RbacScope } from "../rbac"

/**
 * An RBAC role to assign to an actor (a user or an invite), optionally
 * constrained to one or more scopes. One role assignment is created per scope,
 * or a single unscoped assignment when no scopes are provided.
 */
export interface CreateActorRoleDTO {
  /**
   * The ID of the role to assign.
   */
  role_id: string

  /**
   * The scopes the role is constrained to, e.g.
   * `[{ type: "organization", id: "org_123" }]`.
   */
  scopes?: RbacScope[] | null
}

/**
 * The user to be created.
 */
export interface CreateUserDTO {
  /**
   * The email of the user.
   */
  email: string

  /**
   * The first name of the user.
   */
  first_name?: string | null

  /**
   * The last name of the user.
   */
  last_name?: string | null

  /**
   * The avatar URL of the user.
   */
  avatar_url?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The RBAC roles to assign to the user, each optionally scoped.
   *
   * @ignore
   */
  roles?: CreateActorRoleDTO[] | null
}

/**
 * The attributes to update in the user.
 */
export interface UpdateUserDTO extends Partial<Omit<CreateUserDTO, "email">> {
  /**
   * The ID of the user.
   */
  id: string
}

/**
 * The invite to be created.
 */
export interface CreateInviteDTO {
  /**
   * The email of the invite.
   */
  email: string

  /**
   * Whether the invite is accepted.
   */
  accepted?: boolean

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The RBAC roles to assign to the user when the invite is accepted, each
   * optionally scoped.
   *
   * @ignore
   */
  roles?: CreateActorRoleDTO[] | null
}

/**
 * The attributes to update in the invite.
 */
export interface UpdateInviteDTO
  extends Partial<Omit<CreateInviteDTO, "email">> {
  /**
   * The ID of the invite.
   */
  id: string
}
