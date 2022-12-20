import { EntityManager } from "typeorm"
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel"
import { v4 } from "uuid"
import { IEventBusService } from "./services/event-bus"

export abstract class TransactionBaseService {
  protected abstract manager_: EntityManager
  protected abstract transactionManager_: EntityManager | undefined
  protected eventBusService_: IEventBusService
  protected transactionId_: string | undefined

  protected constructor(
    protected readonly __container__: any,
    protected readonly __configModule__?: Record<string, unknown>
  ) {}

  withTransaction(transactionManager?: EntityManager): this {
    if (!transactionManager) {
      return this
    }

    const cloned = new (this.constructor as any)(
      this.__container__,
      this.__configModule__
    )

    cloned.manager_ = transactionManager
    cloned.transactionManager_ = transactionManager
    cloned.eventBusService_ = this.__container__.eventBusService

    return cloned
  }

  protected shouldRetryTransaction_(
    err: { code: string } | Record<string, unknown>
  ): boolean {
    if (!(err as { code: string })?.code) {
      return false
    }
    const code = (err as { code: string })?.code
    return code === "40001" || code === "40P01"
  }

  /**
   * Wraps some work within a transactional block. If the service already has
   * a transaction manager attached this will be reused, otherwise a new
   * transaction manager is created.
   * @param work - the transactional work to be done
   * @param isolationOrErrorHandler - the isolation level to be used for the work.
   * @param maybeErrorHandlerOrDontFail Potential error handler
   * @return the result of the transactional work
   */
  protected async atomicPhase_<TResult, TError>(
    work: (
      transactionManager: EntityManager,
      transactionId?: string
    ) => Promise<TResult | never>,
    isolationOrErrorHandler?:
      | IsolationLevel
      | ((error: TError) => Promise<never | TResult | void>),
    maybeErrorHandlerOrDontFail?: (
      error: TError
    ) => Promise<never | TResult | void>,
    options: Record<string, unknown> & { transactionId?: string } = {}
  ): Promise<never | TResult> {
    let errorHandler = maybeErrorHandlerOrDontFail
    let isolation:
      | IsolationLevel
      | ((error: TError) => Promise<never | TResult | void>)
      | undefined
      | null = isolationOrErrorHandler
    let dontFail = false
    if (typeof isolationOrErrorHandler === "function") {
      isolation = null
      errorHandler = isolationOrErrorHandler
      dontFail = !!maybeErrorHandlerOrDontFail
    }

    // If no transaction id is provided, we generate uuid to use
    const txId = options?.transactionId ?? this.transactionId_ ?? v4()
    this.transactionId_ = txId

    // If the transaction manager is already set, we are in an ongoing
    // transaction and therefore we should use that manager for subsequent work.
    if (this.transactionManager_) {
      const doWork = async (m: EntityManager): Promise<never | TResult> => {
        this.manager_ = m
        this.transactionManager_ = m

        try {
          const result = await work(m, txId)
          // After the transaction is complete, we process cached events
          // eslint-disable-next-line
          this.eventBusService_.processCachedEvents(txId)
          return result
        } catch (error) {
          if (errorHandler) {
            const queryRunner = this.transactionManager_.queryRunner
            if (queryRunner && queryRunner.isTransactionActive) {
              await queryRunner.rollbackTransaction()
            }

            await errorHandler(error)
          }

          // If the transaction fails, we destroy cached events
          // eslint-disable-next-line
          this.eventBusService_.destroyCachedEvents(txId)
          throw error
        }
      }

      return await doWork(this.transactionManager_)
    } else {
      const temp = this.manager_
      const doWork = async (m: EntityManager): Promise<never | TResult> => {
        this.manager_ = m
        this.transactionManager_ = m
        try {
          const result = await work(m, txId)
          this.manager_ = temp
          this.transactionManager_ = undefined
          // After the transaction is complete, we process cached events
          // eslint-disable-next-line
          this.eventBusService_.processCachedEvents(txId)
          return result
        } catch (error) {
          this.manager_ = temp
          this.transactionManager_ = undefined
          // After the transaction is complete, we process cached events
          // eslint-disable-next-line
          this.eventBusService_.destroyCachedEvents(txId)
          throw error
        }
      }

      if (isolation && this.manager_) {
        let result
        try {
          result = await this.manager_.transaction(
            isolation as IsolationLevel,
            async (m) => doWork(m)
          )
          return result
        } catch (error) {
          if (this.shouldRetryTransaction_(error)) {
            return this.manager_.transaction(
              isolation as IsolationLevel,
              async (m): Promise<never | TResult> => doWork(m)
            )
          } else {
            if (errorHandler) {
              await errorHandler(error)
            }
            throw error
          }
        }
      }

      try {
        return await this.manager_.transaction(async (m) => doWork(m))
      } catch (error) {
        if (errorHandler) {
          const result = await errorHandler(error)
          if (dontFail) {
            return result as TResult
          }
        }

        throw error
      }
    }
  }
}
