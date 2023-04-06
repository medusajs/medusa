import { ClaimOrder } from "../models/claim-order"
import { dataSource } from "../loaders/database"

export const ClaimRepository = dataSource.getRepository(ClaimOrder)
export default ClaimRepository
