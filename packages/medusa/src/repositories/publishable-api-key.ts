import { PublishableApiKey } from "../models"
import { dataSource } from "../loaders/database"

// eslint-disable-next-line max-len
export const PublishableApiKeyRepository = dataSource.getRepository(PublishableApiKey)
export default PublishableApiKeyRepository
