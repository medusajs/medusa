import { dataSource } from "../loaders/database"
import { ClaimTag } from "../models/claim-tag"

export const ClaimTagRepository = dataSource.getRepository(ClaimTag)
export default ClaimTagRepository
