import { dataSource } from "../loaders/database"
import { ClaimOrder } from "../models/claim-order"

export const ClaimRepository = dataSource.getRepository(ClaimOrder)
export default ClaimRepository
