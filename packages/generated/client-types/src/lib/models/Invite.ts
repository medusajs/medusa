/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * An invite is created when an admin user invites a new user to join the store's team. Once the invite is accepted, it's deleted.
 */
export interface Invite {
  /**
   * The invite's ID
   */
  id: string
  /**
   * The email of the user being invited.
   */
  user_email: string
  /**
   * The user's role. These roles don't change the privileges of the user.
   */
  role: "admin" | "member" | "developer" | null
  /**
   * Whether the invite was accepted or not.
   */
  accepted: boolean
  /**
   * The token used to accept the invite.
   */
  token: string
  /**
   * The date the invite expires at.
   */
  expires_at: string
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
