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
   * The ID of the actor creating the invites. When provided, the
   * actor must have all the policies of the roles assigned to the invites.
   */
  actor_id?: string
  /**
   * The type of the actor creating the invites.
   *
   * @defaultValue user
   */
  actor?: string
}
