import { RbacScope } from "../../rbac"

export interface DeleteUserWorkflowInput {
  ids: string[]
  /**
   * The ID of the actor deleting the users. When provided, the actor must be
   * able to grant the roles assigned to the users, since deleting the users
   * removes those assignments.
   */
  granting_actor_id?: string
  /**
   * The actor's type. Defaults to `user`.
   */
  granting_actor?: string
  /**
   * The scope the actor is acting within.
   */
  granting_scope?: RbacScope
}
