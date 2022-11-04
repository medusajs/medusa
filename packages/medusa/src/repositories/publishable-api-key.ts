import { EntityRepository, Repository } from "typeorm"

import { PublishableApiKey } from "../models/publishable-api-key"

@EntityRepository(PublishableApiKey)
export class PublishableApiKeyRepository extends Repository<PublishableApiKey> {}
