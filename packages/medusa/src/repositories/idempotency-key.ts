import { dataSource } from "../loaders/database"
import { IdempotencyKey } from "../models"

export const IdempotencyKeyRepository = dataSource.getRepository(IdempotencyKey)
export default IdempotencyKeyRepository
