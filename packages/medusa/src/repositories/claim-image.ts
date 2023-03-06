import { dataSource } from "../loaders/database"
import { ClaimImage } from "../models/claim-image"

export const ClaimImageRepository = dataSource.getRepository(ClaimImage)
export default ClaimImageRepository
