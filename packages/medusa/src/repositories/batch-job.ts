import { dataSource } from "../loaders/database"
import { BatchJob } from "../models"

export const BatchJobRepository = dataSource.getRepository(BatchJob)
export default BatchJobRepository
