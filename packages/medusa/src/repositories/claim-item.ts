import { ClaimItem } from "../models/claim-item"
import { dataSource } from "../loaders/database"

export const ClaimItemRepository = dataSource.getRepository(ClaimItem)
export default ClaimItemRepository
