import { dataSource } from "../loaders/database"
import { StagedJob } from "../models"

export const StagedJobRepository = dataSource.getRepository(StagedJob)
export default StagedJobRepository
