import { ClaimTag } from "../models/claim-tag"
import { dataSource } from "../loaders/database"

export const ClaimTagRepository = dataSource.getRepository(ClaimTag)
export default ClaimTagRepository
