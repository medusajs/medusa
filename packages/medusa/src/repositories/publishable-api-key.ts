import { EntityRepository, Repository } from "typeorm"

import { PublishableApiKey } from "../models"

@EntityRepository(PublishableApiKey)
// eslint-disable-next-line max-len
export default class PublishableApiKeyRepository extends Repository<PublishableApiKey> {}
