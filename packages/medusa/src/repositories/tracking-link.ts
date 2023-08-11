import { TrackingLink } from "../models"
import { dataSource } from "../loaders/database"

export const TrackingLinkRepository = dataSource.getRepository(TrackingLink)
export default TrackingLinkRepository
