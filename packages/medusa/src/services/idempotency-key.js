import { MedusaError } from "medusa-core-utils"
import { v4 } from "uuid"
import { TransactionBaseService } from "../interfaces"

const KEY_LOCKED_TIMEOUT = 1000

class IdempotencyKeyService extends TransactionBaseService {
  constructor({ manager, idempotencyKeyRepository }) {
    super({ manager, idempotencyKeyRepository })

    /** @private @constant {EntityManager} */
    this.manager_ = manager

    /** @private @constant {IdempotencyKeyRepository} */
    this.idempotencyKeyRepository_ = idempotencyKeyRepository
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
    return this.atomicPhase_(async (_) => {
      // If idempotency key exists, return it
      let key = await this.retrieve(headerKey)

      if (key) {
        return key
      }

      key = await this.create({
        request_method: reqMethod,
        request_params: reqParams,
        request_path: reqPath,
      })

      return key
    }, "SERIALIZABLE")
  }

  /**
   * Creates an idempotency key for a request.
   * If no idempotency key is provided in request, we will create a unique
   * identifier.
   * @param {object} payload - payload of request to create idempotency key for
   * @return {Promise<IdempotencyKeyModel>} the created idempotency key
   */
  async create(payload) {
    return this.atomicPhase_(async (manager) => {
      const idempotencyKeyRepo = manager.getCustomRepository(
        this.idempotencyKeyRepository_
      )

      if (!payload.idempotency_key) {
        payload.idempotency_key = v4()
      }

      const created = await idempotencyKeyRepo.create(payload)
      const result = await idempotencyKeyRepo.save(created)
      return result
    })
  }

  /**
   * Retrieves an idempotency key
   * @param {string} idempotencyKey - key to retrieve
   * @return {Promise<IdempotencyKeyModel>} idempotency key
   */
  async retrieve(idempotencyKey) {
    const idempotencyKeyRepo = this.manager_.getCustomRepository(
      this.idempotencyKeyRepository_
    )

    const key = await idempotencyKeyRepo.findOne({
      where: { idempotency_key: idempotencyKey },
    })

    return key
  }

  /**
   * Locks an idempotency.
   * @param {string} idempotencyKey - key to lock
   * @return {Promise} result of the update operation
   */
  async lock(idempotencyKey) {
    return this.atomicPhase_(async (manager) => {
      const idempotencyKeyRepo = manager.getCustomRepository(
        this.idempotencyKeyRepository_
      )

      const key = this.retrieve(idempotencyKey)

      if (key.locked_at && key.locked_at > Date.now() - KEY_LOCKED_TIMEOUT) {
        throw new MedusaError("conflict", "Key already locked")
      }

      const updated = await idempotencyKeyRepo.save({
        ...key,
        locked_at: Date.now(),
      })

      return updated
    })
  }

  /**
   * Locks an idempotency.
   * @param {string} idempotencyKey - key to update
   * @param {object} update - update object
   * @return {Promise} result of the update operation
   */
  async update(idempotencyKey, update) {
    return this.atomicPhase_(async (manager) => {
      const idempotencyKeyRepo = manager.getCustomRepository(
        this.idempotencyKeyRepository_
      )

      const iKey = await this.retrieve(idempotencyKey)

      for (const [key, value] of Object.entries(update)) {
        iKey[key] = value
      }

      const updated = await idempotencyKeyRepo.save(iKey)
      return updated
    })
  }

  /**
   * Performs an atomic work stage.
   * An atomic work stage contains some related functionality, that needs to be
   * transactionally executed in isolation. An idempotent request will
   * always consist of 2 or more of these phases. The required phases are
   * "started" and "finished".
   * @param {string} idempotencyKey - current idempotency key
   * @param {Function} func - functionality to execute within the phase
   * @return {IdempotencyKeyModel} new updated idempotency key
   */
  async workStage(idempotencyKey, func) {
    try {
      return await this.atomicPhase_(async (manager) => {
        let key

        const { recovery_point, response_code, response_body } = await func(
          manager
        )

        if (recovery_point) {
          key = await this.update(idempotencyKey, {
            recovery_point,
          })
        } else {
          key = await this.update(idempotencyKey, {
            recovery_point: "finished",
            response_body,
            response_code,
          })
        }

        return { key }
      }, "SERIALIZABLE")
    } catch (err) {
      return { error: err }
    }
  }
}

export default IdempotencyKeyService
