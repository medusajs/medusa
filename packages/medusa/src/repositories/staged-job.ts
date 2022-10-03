import { StagedJob } from "../models"
import { dataSource } from "../loaders/database"

export const StagedJobRepository = dataSource.getRepository(StagedJob)
export default StagedJobRepository
