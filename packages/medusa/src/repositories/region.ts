import { Region } from "../models"
import { dataSource } from "../loaders/database"

export const RegionRepository = dataSource.getRepository(Region)
export default RegionRepository
