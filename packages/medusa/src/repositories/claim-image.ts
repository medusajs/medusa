import { ClaimImage } from "../models/claim-image"
import { dataSource } from "../loaders/database"

export const ClaimImageRepository = dataSource.getRepository(ClaimImage)
export default ClaimImageRepository
