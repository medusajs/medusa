import { RbacGrantingContext } from "../../rbac"
import { CreateInviteDTO } from "../../user"

/**
 * The data to create invites.
 */
export interface CreateInvitesWorkflowInputDTO {
  /**
   * The invites to create.
   */
  invites: CreateInviteDTO[]

  /**
   * The actor creating the invites. When provided, it can only invite users
   * to roles whose policies it holds itself.
   *
   * @since 2.22.4
   */
  rbac_context?: RbacGrantingContext
}
