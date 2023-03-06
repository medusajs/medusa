import { dataSource } from "../loaders/database"
import { ClaimItem } from "../models/claim-item"

export const ClaimItemRepository = dataSource.getRepository(ClaimItem)
export default ClaimItemRepository
