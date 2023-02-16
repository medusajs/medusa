import { Invite } from "../models"
import { dataSource } from "../loaders/database"

export const InviteRepository = dataSource.getRepository(Invite)
export default InviteRepository
