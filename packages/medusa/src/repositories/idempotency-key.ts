import { IdempotencyKey } from "../models"
import { dataSource } from "../loaders/database"

export const IdempotencyKeyRepository = dataSource.getRepository(IdempotencyKey)
export default IdempotencyKeyRepository
