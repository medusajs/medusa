import { dataSource } from "../loaders/database"
import { PublishableApiKey } from "../models"

// eslint-disable-next-line max-len
export const PublishableApiKeyRepository = dataSource.getRepository(PublishableApiKey)
export default PublishableApiKeyRepository
