import { Request, Response } from "express"
import { IdempotencyKey } from "../../models"
import IdempotencyKeyService from "../../services/idempotency-key"
import { EntityManager } from "typeorm"

export async function initializeIdempotencyRequest(
  req: Request,
  res: Response
): Promise<IdempotencyKey> {
  const idempotencyKeyService: IdempotencyKeyService = req.scope.resolve(
    "idempotencyKeyService"
  )
  const manager: EntityManager = req.scope.resolve("manager")

  const headerKey = req.get("Idempotency-Key") || ""

  let idempotencyKey
  idempotencyKey = await idempotencyKeyService
    .withTransaction(manager)
    .initializeRequest(headerKey, req.method, req.params, req.path)

  res.setHeader("Access-Control-Expose-Headers", "Idempotency-Key")
  res.setHeader("Idempotency-Key", idempotencyKey.idempotency_key)

  return idempotencyKey
}
