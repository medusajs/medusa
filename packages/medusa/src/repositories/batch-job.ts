import { BatchJob } from "../models"
import { dataSource } from "../loaders/database"

export const BatchJobRepository = dataSource.getRepository(BatchJob)
export default BatchJobRepository
