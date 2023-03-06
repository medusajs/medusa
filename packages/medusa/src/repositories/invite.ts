import { dataSource } from "../loaders/database"
import { Invite } from "../models"

export const InviteRepository = dataSource.getRepository(Invite)
export default InviteRepository
