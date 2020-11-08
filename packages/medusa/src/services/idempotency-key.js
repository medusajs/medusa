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
   * Execute the initial steps in a idempotent request.
   * @param {string} headerKey - potential idempotency key from header
   * @param {string} reqMethod - method of request
   * @param {string} reqParams - params of request
   * @param {string} reqPath - path of request
   * @return {Promise<IdempotencyKeyModel>} the existing or created idempotency key
   */
  async initializeRequest(headerKey, reqMethod, reqParams, reqPath) {
    // If idempotency key exists, return it
    let key = await this.retrieve(headerKey)
    if (key) {
      return key
    }

    const dbSession = await this.transactionService_.createSession()
    await dbSession.startTransaction()

    try {
      key = await this.create(
        {
          request_method: reqMethod,
          request_params: reqParams,
          request_path: reqPath,
        },
        dbSession
      )
      await dbSession.commitTransaction()
      return key
    } catch (error) {
      await dbSession.abortTransaction()
      throw error
    } finally {
      dbSession.endSession()
    }
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

  /**
   * Retrieves an idempotency key
   * @param {string} idempotencyKey - key to retrieve
   * @param {object} session - mongoose transaction session
   * @return {Promise<IdempotencyKeyModel>} idempotency key
   */
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

  /**
   * Locks an idempotency.
   * @param {string} idempotencyKey - key to lock
   * @param {object} session - mongoose transaction session
   * @return {Promise} result of the update operation
   */
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

  /**
   * Locks an idempotency.
   * @param {string} idempotencyKey - key to update
   * @param {object} update - update object
   * @param {object} session - mongoose transaction session
   * @return {Promise} result of the update operation
   */
  async update(idempotencyKey, update, session) {
    return this.idempotencyKeyModel_.updateOne(
      { idempotency_key: idempotencyKey },
      { $set: update },
      { session }
    )
  }

  /**
   * Performs an atomic phase.
   * An atomic phase contains some related functionality, that needs to be
   * transactionally executed in isolation. An idempotent request will
   * always consist of 2 or more of these phases. The required phases are
   * "started" and "finished".
   * @param {string} idempotencyKey - current idempotency key
   * @param {Function} func - functionality to execute within the phase
   * @return {IdempotencyKeyModel} new updated idempotency key
   */
  async atomicPhase(idempotencyKey, func) {
    let key
    const session = await this.transactionService_.createSession()
    await session.startTransaction()

    try {
      const { recovery_point, response_code, response_body } = await func(
        session
      )

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
    } finally {
      session.endSession()
    }
    return { key }
  }
}

export default IdempotencyKeyService
