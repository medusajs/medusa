import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"
import { v4 } from "uuid"
import IdempotencyKeyModel from "../models/idempotency-key"

const KEY_LOCKED_TIMEOUT = 1000

class IdempotencyKeyService extends BaseService {
  constructor({ idempotencyKeyModel, transactionService }) {
    super()

    /** @private @constant {IdempotencyKeyModel} */
    this.idempotencyKeyModel_ = idempotencyKeyModel

    /** @private @constant {TransactionService} */
    this.transactionService_ = transactionService
  }

  /**
   * Creates an idempotency key for a request.
   * If no idempotency key is provided in request, we will create a unique
   * identifier.
   * @param {object} payload - payload of request to create idempotency key for
   * @param {object} session - mongoose transaction session
   * @return {Promise<IdempotencyKeyModel>} the created idempotency key
   */
  async create(payload, session) {
    if (!payload.idempotency_key) {
      payload.idempotency_key = v4()
    }

    return this.idempotencyKeyModel_
      .create([payload], { session })
      .then(result => result[0])
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  async retrieve(idempotencyKey, session) {
    if (session) {
      return this.idempotencyKeyModel_.findOne(
        { idempotency_key: idempotencyKey },
        { session }
      )
    } else {
      return this.idempotencyKeyModel_.findOne({
        idempotency_key: idempotencyKey,
      })
    }
  }

  async lock(idempotencyKey, session) {
    const key = await this.idempotencyKeyModel_.findOne(
      { idempotency_key: idempotencyKey },
      { session }
    )

    if (key.locked_at && key.locked_at > Date.now() - KEY_LOCKED_TIMEOUT) {
      throw new MedusaError("conflict", "Key already locked")
    }

    return this.idempotencyKeyModel_.updateOne(
      { idempotency_key: idempotencyKey },
      { locked_at: Date.now() },
      { session }
    )
  }

  async update(idempotencyKey, update, session) {
    const test = await this.idempotencyKeyModel_.updateOne(
      { idempotency_key: idempotencyKey },
      { $set: update },
      { session }
    )
    return test
  }

  async atomicPhase(idempotencyKey, func) {
    let key
    const session = await this.transactionService_.createSession()
    await session.startTransaction()

    try {
      const { recovery_point, response_code, response_body } = await func(
        session
      )

      console.log(recovery_point, response_code, response_body)

      if (recovery_point) {
        key = await this.update(
          idempotencyKey,
          {
            recovery_point,
          },
          session
        )
      } else {
        key = await this.update(
          idempotencyKey,
          {
            recovery_point: "finished",
            response_body,
            response_code,
          },
          session
        )
      }
      await session.commitTransaction()
    } catch (err) {
      await session.abortTransaction()

      return { error: err }
    }

    return { key }
  }
}

export default IdempotencyKeyService
