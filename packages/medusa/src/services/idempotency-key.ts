import { isDefined, MedusaError } from "medusa-core-utils"
import { v4 } from "uuid"
import { TransactionBaseService } from "../interfaces"
import { DeepPartial, EntityManager } from "typeorm"
import { IdempotencyKeyRepository } from "../repositories/idempotency-key"
import { IdempotencyKey } from "../models"
import {
  CreateIdempotencyKeyInput,
  IdempotencyCallbackResult,
} from "../types/idempotency-key"

const KEY_LOCKED_TIMEOUT = 1000

type InjectedDependencies = {
  manager: EntityManager
  idempotencyKeyRepository: typeof IdempotencyKeyRepository
}

class IdempotencyKeyService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly idempotencyKeyRepository_: typeof IdempotencyKeyRepository

  constructor({ manager, idempotencyKeyRepository }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.idempotencyKeyRepository_ = idempotencyKeyRepository
  }

  /**
   * Execute the initial steps in a idempotent request.
   * @param headerKey - potential idempotency key from header
   * @param reqMethod - method of request
   * @param reqParams - params of request
   * @param reqPath - path of request
   * @return the existing or created idempotency key
   */
  async initializeRequest(
    headerKey: string,
    reqMethod: string,
    reqParams: Record<string, unknown>,
    reqPath: string
  ): Promise<IdempotencyKey> {
    return await this.atomicPhase_(async () => {
      const key = await this.retrieve(headerKey).catch(() => void 0)
      if (key) {
        return key
      }
      return await this.create({
        request_method: reqMethod,
        request_params: reqParams,
        request_path: reqPath,
      })
    }, "SERIALIZABLE")
  }

  /**
   * Creates an idempotency key for a request.
   * If no idempotency key is provided in request, we will create a unique
   * identifier.
   * @param payload - payload of request to create idempotency key for
   * @return the created idempotency key
   */
  async create(payload: CreateIdempotencyKeyInput): Promise<IdempotencyKey> {
    return await this.atomicPhase_(async (manager) => {
      const idempotencyKeyRepo = manager.getCustomRepository(
        this.idempotencyKeyRepository_
      )

      payload.idempotency_key = payload.idempotency_key ?? v4()

      const created = idempotencyKeyRepo.create(payload)
      return await idempotencyKeyRepo.save(created)
    })
  }

  /**
   * Retrieves an idempotency key
   * @param idempotencyKey - key to retrieve
   * @return idempotency key
   */
  async retrieve(idempotencyKey: string): Promise<IdempotencyKey | never> {
    if (!isDefined(idempotencyKey)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"idempotencyKey" must be defined`
      )
    }

    const idempotencyKeyRepo = this.manager_.getCustomRepository(
      this.idempotencyKeyRepository_
    )

    const iKey = await idempotencyKeyRepo.findOne({
      where: { idempotency_key: idempotencyKey },
    })

    if (!iKey) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Idempotency key ${idempotencyKey} was not found`
      )
    }

    return iKey
  }

  /**
   * Locks an idempotency.
   * @param idempotencyKey - key to lock
   * @return result of the update operation
   */
  async lock(idempotencyKey: string): Promise<IdempotencyKey | never> {
    return await this.atomicPhase_(async (manager) => {
      const idempotencyKeyRepo = manager.getCustomRepository(
        this.idempotencyKeyRepository_
      )

      const key = await this.retrieve(idempotencyKey)

      const isLocked =
        key.locked_at &&
        new Date(key.locked_at).getTime() > Date.now() - KEY_LOCKED_TIMEOUT

      if (isLocked) {
        throw new MedusaError(MedusaError.Types.CONFLICT, "Key already locked")
      }

      return await idempotencyKeyRepo.save({
        ...key,
        locked_at: Date.now(),
      })
    })
  }

  /**
   * Locks an idempotency.
   * @param {string} idempotencyKey - key to update
   * @param {object} update - update object
   * @return {Promise} result of the update operation
   */
  async update(
    idempotencyKey: string,
    update: DeepPartial<IdempotencyKey>
  ): Promise<IdempotencyKey> {
    return await this.atomicPhase_(async (manager) => {
      const idempotencyKeyRepo = manager.getCustomRepository(
        this.idempotencyKeyRepository_
      )

      const iKey = await this.retrieve(idempotencyKey)

      for (const [key, value] of Object.entries(update)) {
        iKey[key] = value
      }

      return await idempotencyKeyRepo.save(iKey)
    })
  }

  /**
   * Performs an atomic work stage.
   * An atomic work stage contains some related functionality, that needs to be
   * transactionally executed in isolation. An idempotent request will
   * always consist of 2 or more of these phases. The required phases are
   * "started" and "finished".
   * @param idempotencyKey - current idempotency key
   * @param callback - functionality to execute within the phase
   * @return new updated idempotency key
   */
  async workStage(
    idempotencyKey: string,
    callback: (
      transactionManager: EntityManager
    ) => Promise<IdempotencyCallbackResult | never>
  ): Promise<IdempotencyKey> {
    return await this.atomicPhase_(async (manager) => {
      const { recovery_point, response_code, response_body } = await callback(
        manager
      )

      const data: DeepPartial<IdempotencyKey> = {
        recovery_point: recovery_point ?? "finished",
      }

      if (!recovery_point) {
        data.response_body = response_body
        data.response_code = response_code
      }

      return await this.update(idempotencyKey, data)
    })
  }
}

export default IdempotencyKeyService
