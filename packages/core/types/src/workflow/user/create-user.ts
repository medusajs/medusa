import { RbacGrantingContext } from "../../rbac"
import { CreateUserDTO } from "../../user"

/**
 * The data to create users.
 */
export interface CreateUsersWorkflowInputDTO {
  /**
   * The users to create.
   */
  users: CreateUserDTO[]

  /**
   * The actor creating the users. When provided, it can only create users
   * with roles whose policies it holds itself.
   *
   * @since 2.22.4
   */
  rbac_context?: RbacGrantingContext
}
