import { TransactionBaseService } from "../../interfaces";
import { EntityManager } from "typeorm";
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel";
import { formatException } from "../exception-formatter";

export type CustomAtomicPhaseExceptionHandler = <T>(this: T, error: unknown) => unknown | Promise<unknown>

export function UseAtomicPhase(customAtomicPhaseExceptionHandler?: CustomAtomicPhaseExceptionHandler) {
  return function <T extends TransactionBaseService<T>>(
    target: T,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): any {
    customAtomicPhaseExceptionHandler = customAtomicPhaseExceptionHandler ?? (async (error) => {
      throw formatException(error)
    })

    const originalMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      return await atomicPhase_.call(this, () => {
        return originalMethod.apply(this, args)
      }, customAtomicPhaseExceptionHandler)
    };
  }
}

async function atomicPhase_<TResult, TError>(
  this: TransactionBaseService<any>,
  work: (transactionManager: EntityManager) => Promise<TResult | never>,
  isolationOrErrorHandler?:
    | IsolationLevel
    | ((error: TError) => Promise<never | TResult | void>),
  maybeErrorHandlerOrDontFail?: (
    error: TError
  ) => Promise<never | TResult | void>
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

  if (this.transactionManager_) {
    const doWork = async (m: EntityManager): Promise<never | TResult> => {
      this.manager_ = m
      this.transactionManager_ = m
      try {
        return await work(m)
      } catch (error) {
        if (errorHandler) {
          const queryRunner = this.transactionManager_.queryRunner
          if (queryRunner && queryRunner.isTransactionActive) {
            await queryRunner.rollbackTransaction()
          }

          await errorHandler(error)
        }
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
        const result = await work(m)
        this.manager_ = temp
        this.transactionManager_ = undefined
        return result
      } catch (error) {
        this.manager_ = temp
        this.transactionManager_ = undefined
        throw error
      }
    }

    if (isolation && this.manager_) {
      let result
      try {
        result = await this.manager_.transaction(
          isolation as IsolationLevel,
          (m) => doWork(m)
        )
        return result
      } catch (error) {
        if (this.shouldRetryTransaction_(error)) {
          return this.manager_.transaction(
            isolation as IsolationLevel,
            (m): Promise<never | TResult> => doWork(m)
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
      return await this.manager_.transaction((m) => doWork(m))
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