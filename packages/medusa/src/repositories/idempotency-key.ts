import { EntityRepository, Repository } from "typeorm"
import { IdempotencyKey } from "../models/idempotency-key"

@EntityRepository(IdempotencyKey)
export class IdempotencyKeyRepository extends Repository<IdempotencyKey> {}
