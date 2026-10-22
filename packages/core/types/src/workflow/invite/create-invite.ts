import { CreateInviteDTO } from "../../user"

/**
 * The data to create invites.
 */
export interface CreateInvitesWorkflowInputDTO {
  /**
   * The invites to create.
   */
  invites: CreateInviteDTO[]
}
