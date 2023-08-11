import { IdempotencyCallbackResult } from "../../types/idempotency-key"
import { EntityManager } from "typeorm"
import { IdempotencyKey } from "../../models"
import { AwilixContainer } from "awilix"
import IdempotencyKeyService from "../../services/idempotency-key"
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel"

export type RunIdempotencyStepOptions = {
  manager: EntityManager
  idempotencyKey: IdempotencyKey
  container: AwilixContainer
  isolationLevel: IsolationLevel
}

export async function runIdempotencyStep(
  handler: ({
    manager,
  }: {
    manager: EntityManager
  }) => Promise<IdempotencyCallbackResult>,
  {
    manager,
    idempotencyKey,
    container,
    isolationLevel,
  }: RunIdempotencyStepOptions
) {
  const idempotencyKeyService: IdempotencyKeyService = container.resolve(
    "idempotencyKeyService"
  )
  return await manager.transaction(
    isolationLevel,
    async (transactionManager) => {
      const idempotencyKey_ = await idempotencyKeyService
        .withTransaction(transactionManager)
        .workStage(idempotencyKey.idempotency_key, async (stageManager) => {
          return await handler({ manager: stageManager })
        })
      idempotencyKey.response_code = idempotencyKey_.response_code
      idempotencyKey.response_body = idempotencyKey_.response_body
      idempotencyKey.recovery_point = idempotencyKey_.recovery_point
    }
  )
}
