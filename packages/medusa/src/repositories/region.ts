import { dataSource } from "../loaders/database"
import { Region } from "../models"

export const RegionRepository = dataSource.getRepository(Region)
export default RegionRepository
