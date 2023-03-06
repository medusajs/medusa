import { dataSource } from "../loaders/database"
import { TrackingLink } from "../models"

export const TrackingLinkRepository = dataSource.getRepository(TrackingLink)
export default TrackingLinkRepository
