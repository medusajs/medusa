import { Context } from "../shared-context"

/**
 * ### constructor
 *
 * The constructor allows you to access resources from the module's container using the first parameter,
 * and the module's options using the second parameter.
 *
 * If you're creating a client or establishing a connection with a third-party service, do it in the constructor.
 *
 * #### Example
 *
 * ```ts
 * import { ILockingProvider } from "@zjedene-medusa/framework/types"
 * import { Logger } from "@zjedene-medusa/framework/types"
 *
 * type InjectedDependencies = {
 *   logger: Logger
 * }
 *
 * type Options = {
 *   url: string
 * }
 *
 * class MyLockingProviderService implements ILockingProvider {
 *   static identifier = "my-lock"
 *   protected logger_: Logger
 *   protected options_: Options
 *   // assuming you're initializing a client
 *   protected client
 *
 *   constructor (
 *     { logger }: InjectedDependencies,
 *     options: Options
 *   ) {
 *     this.logger_ = logger
 *     this.options_ = options
 *
 *     // assuming you're initializing a client
 *     this.client = new Client(options)
 *   }
 *
 *   // ...
 * }
 *
 * export default MyLockingProviderService
 * ```
 * 
 * ### Identifier
 * 
 * Every locking module provider must have an `identifier` static property. The provider's ID
 * will be stored as `lp_{identifier}`.
 * 
 * For example:
 * 
 * ```ts
 * class MyLockingProviderService implements ILockingProvider {
 *   static identifier = "my-lock"
 *   // ...
 * }
 * ```
 */
export interface ILockingProvider {
  /**
   * This method executes a given asynchronous job with a lock on the given keys. The Locking Module uses this method
   * when you call its `execute` method and your provider is the default provider, or you pass your provider's identifier to its `execute` method.
   * 
   * In the method, you should first try to acquire the lock on the given keys before the specified timeout passes.
   * Then, once the lock is acquired, you execute the job. Otherwise, if the timeout passes before the lock is acquired, you cancel the job.
   * 
   * @param keys - The keys to lock during the job's execution.
   * @param job - The asynchronous job to execute while the keys are locked.
   * @param args - Additional arguments for the job execution.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns The result of the job.
   * @typeParam T - The type of the job's result.
   * 
   * @example
   * An example of how to implement the `execute` method:
   * 
   * ```ts
   * // other imports...
   * import { Context } from "@zjedene-medusa/framework/types"
   * import { setTimeout } from "node:timers/promises"
   * 
   * class MyLockingProviderService implements ILockingProvider {
   *   // ...
   * async execute<T>(
   *     keys: string | string[], 
   *     job: () => Promise<T>, 
   *     args?: { timeout?: number }, 
   *     sharedContext?: Context
   *   ): Promise<T> {
   *     // TODO you can add actions using the third-party client you initialized in the constructor
   *     const timeout = Math.max(args?.timeout ?? 5, 1)
   *     const timeoutSeconds = Number.isNaN(timeout) ? 1 : timeout
   *     const cancellationToken = { cancelled: false }
   *     const promises: Promise<any>[] = []
   * 
   *     if (timeoutSeconds > 0) {
   *       promises.push(this.getTimeout(timeoutSeconds, cancellationToken))
   *     }
   * 
   *     promises.push(
   *       this.acquire_(
   *         keys,
   *         {
   *           expire: args?.timeout ? timeoutSeconds : 0,
   *         },
   *         cancellationToken
   *       )
   *     )
   * 
   *     await Promise.race(promises)
   * 
   *     try {
   *       return await job()
   *     } finally {
   *       await this.release(keys)
   *     }
   *   }
   * 
   *   private async getTimeout(
   *     seconds: number,
   *     cancellationToken: { cancelled: boolean }
   *   ): Promise<void> {
   *     return new Promise(async (_, reject) => {
   *       await setTimeout(seconds * 1000)
   *       cancellationToken.cancelled = true
   *       reject(new Error("Timed-out acquiring lock."))
   *     })
   *   }
   * }
   * ```
   * 
   * In this example, you first determine the timeout for acquiring the lock. You also create a `cancellationToken` object that you'll use to determine if the lock aquisition has timed out.
   * 
   * You then create an array of the following promises:
   * 
   * - A timeout promise that, if the lock acquisition takes longer than the timeout, sets the `cancelled` property of the `cancellationToken` object to `true`.
   * - A promise that acquires the lock. You use a private `acquire_` method which you can find its implementation in the `aquire` method's example. If the first promise 
   * resolves and cancels the lock acquisition, the lock will not be acquired.
   * 
   * Finally, if the lock is acquired, you execute the job and release the lock after the job is done using the `release` method.
   */
  execute<T>(
    keys: string | string[],
    job: () => Promise<T>,
    args?: {
      /**
       * The timeout (in seconds) for acquiring the lock. If the time out is passed, the job is canceled and the lock is released.
       */
      timeout?: number
    },
    sharedContext?: Context
  ): Promise<T>
  /**
   * This method acquires a lock on the given keys. The Locking Module uses this method when you call its `acquire` method and your provider is the default provider,
   * or you pass your provider's identifier to its `acquire` method.
   * 
   * In this method, you should only aquire the lock if the timeout hasn't passed. As explained in the {@link execute} method's example,
   * you can use a `cancellationToken` object to determine if the lock acquisition has timed out.
   * 
   * If the lock aquisition isn't canceled, you should aquire the lock, setting its expiry and owner. You should account for the following scenarios:
   * 
   * - The lock doesn't have an owner and you don't pass an owner, in which case the lock can be extended or released by anyone.
   * - The lock doesn't have an owner or has the same owner that you pass, in which case you can extend the lock's expiration time and set the owner.
   * - The lock has an owner, but you pass a different owner, in which case the method should throw an error.
   * 
   * @param keys - The keys to acquire the lock on.
   * @param args - Additional arguments for acquiring the lock.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns Resolves when the lock is acquired.
   * 
   * @example
   * An example of how to implement the `acquire` method:
   * 
   * ```ts
   * type ResolvablePromise = {
   *   promise: Promise<any>
   *   resolve: () => void
   * }
   * 
   * class MyLockingProviderService implements ILockingProvider {
   *   // ...
   *   async acquire(
   *     keys: string | string[],
   *     args?: {
   *       ownerId?: string | null
   *       expire?: number
   *       awaitQueue?: boolean
   *     }
   *   ): Promise<void> {
   *     return this.acquire_(keys, args)
   *   }
   * 
   *   async acquire_(
   *     keys: string | string[],
   *     args?: {
   *       ownerId?: string | null
   *       expire?: number
   *       awaitQueue?: boolean
   *     },
   *     cancellationToken?: { cancelled: boolean }
   *   ): Promise<void> {
   *     keys = Array.isArray(keys) ? keys : [keys]
   *     const { ownerId, expire } = args ?? {}
   * 
   *     for (const key of keys) {
   *       if (cancellationToken?.cancelled) {
   *         throw new Error("Timed-out acquiring lock.")
   *       }
   * 
   *       // assuming your client has this method and it validates the owner and expiration
   *       const result = await this.client.acquireLock(key, ownerId, expire)
   * 
   *       if (result !== 1) {
   *         throw new Error(`Failed to acquire lock for key "${key}"`)
   *       }
   *     }
   *   }
   * }
   * ```
   * 
   * In this example, you add a private `acquire_` method that you use to acquire the lock. This method accepts an additional `cancellationToken` argument that you can use to determine if the lock acquisition has timed out.
   * You can then use this method in other methods, such as the `execute` method.
   * 
   * In the `acquire_` method, you loop through the keys and try to acquire the lock on each key if the lock acquisition hasn't timed out. If the lock acquisition fails, you throw an error.
   * This method assumes that the client you're integrating has a method called `acquireLock` that validates the owner and expiration time, and returns `1` if the lock is successfully acquired.
   */
  acquire(
    keys: string | string[],
    args?: {
      /**
       * The ID of the lock's owner. If specified, only the owner can release the lock or extend its expiration time.
       */
      ownerId?: string | null
      /**
       * The expiration time (in seconds) for the lock. If the lock is already acquired and the owner is the same, the expiration time is extended
       * by the value passed. If not specified, the lock does not expire.
       */
      expire?: number
    },
    sharedContext?: Context
  ): Promise<void>
  /**
   * This method releases a lock on the given keys. The Locking Module uses this method when you call its `release` method and your provider is the default provider,
   * or you pass your provider's identifier to its `release` method.
   * 
   * In this method, you should release the lock on the given keys. If the lock has an owner, you should only release the lock if the owner is the same as the one passed.
   * 
   * @param keys - The keys to release the lock from.
   * @param args - Additional arguments for releasing the lock.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns Whether the lock was successfully released. If the lock has a different owner than the one passed, the method returns `false`.
   * 
   * @example
   * An example of how to implement the `release` method:
   * 
   * ```ts
   * // other imports...
   * import { promiseAll } from "@zjedene-medusa/framework/utils"
   * 
   * class MyLockingProviderService implements ILockingProvider {
   *   // ...
   *   async release(
   *     keys: string | string[], 
   *     args?: { ownerId?: string | null }, 
   *     sharedContext?: Context
   *   ): Promise<boolean> {
   *     const ownerId = args?.ownerId ?? "*"
   *     keys = Array.isArray(keys) ? keys : [keys]
   * 
   *     const releasePromises = keys.map(async (key) => {
   *       // assuming your client has this method and it validates the owner
   *       const result = await this.client.releaseLock(key, ownerId)
   *       return result === 1
   *     })
   * 
   *     const results = await promiseAll(releasePromises)
   * 
   *     return results.every((released) => released)
   *   }
   * }
   * ```
   * 
   * In this example, you loop through the keys and try to release the lock on each key using the client you're integrating. This implementation assumes that the client validates
   * ownership of the lock and returns a result of `1` if the lock is successfully released.
   */
  release(
    keys: string | string[],
    args?: {
      /**
       * The ID of the lock's owner. The lock can be released either if it doesn't have an owner, or
       * if its owner ID matches the one passed in this property.
       */
      ownerId?: string | null
    },
    sharedContext?: Context
  ): Promise<boolean>
  /**
   * This method releases all locks. The Locking Module uses this method when you call its `releaseAll` method and your provider is the default provider,
   * or you pass your provider's identifier to its `releaseAll` method.
   * 
   * In this method, you should release all locks if no owner is passed. If an owner is passed, you should only release the locks that the owner has acquired.
   * 
   * @param args - Additional arguments for releasing the locks.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * 
   * @example
   * An example of how to implement the `releaseAll` method:
   * 
   * ```ts
   * class MyLockingProviderService implements ILockingProvider {
   *   // ...
   *   async releaseAll(
   *     args?: { ownerId?: string | null }, 
   *     sharedContext?: Context
   *   ): Promise<void> {
   *     const ownerId = args?.ownerId ?? "*"
   * 
   *     await this.client.releaseAllLock(ownerId)
   *   }
   * }
   * ```
   * 
   * In this example, you release all locks either of all owners or the owner passed as an argument. This implementation assumes that the client you're integrating has a method called `releaseAllLock` that releases all locks
   * for all owners or a specific owner.
   */
  releaseAll(
    args?: {
      /**
       * The ID of a lock owner. If specified, all locks that the owner has acquired are released.
       */
      ownerId?: string | null
    },
    sharedContext?: Context
  ): Promise<void>
}

export interface ILockingModule {
  /**
   * This method executes a giuven asynchronous job with a lock on the given keys. You can optionally pass a 
   * provider name to be used for locking. If no provider is passed, the default provider (in-memory or the 
   * provider configuerd in `medusa-config.ts`) will be used.
   * 
   * @param keys - The keys to lock durng the job's execution.
   * @param job - The asynchronous job to execute while the keys are locked.
   * @param args - Additional arguments for the job execution.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns The result of the job execution.
   * @typeParam T - The type of the job's result.
   * 
   * @example
   * For example, to use the lock module when deleting a product:
   * 
   * ```ts
   * await lockingModuleService.execute("prod_123", async () => {
   *    // assuming you've resolved the product service from the container
   *    await productModuleService.delete("prod_123")
   * })
   * ```
   * 
   * In the above example, the product of ID `prod_123` is locked while it's being deleted.
   * 
   * To specify the provider to use for locking, you can pass the provider name in the `args` argument:
   * 
   * ```ts
   * await lockingModuleService.execute("prod_123", async () => {
   *   // assuming you've resolved the product service from the container
   *   await productModuleService.delete("prod_123")
   * }, {
   *   provider: "lp_my-lock"
   * })
   * ```
   */
  execute<T>(
    keys: string | string[],
    job: () => Promise<T>,
    args?: {
      /**
       * The timeout (in seconds) for acquiring the lock. If the time out is passed, the job is canceled and the lock is released.
       * Its value defaults to `5` seconds if no value is passed or if you pass a value less than `1`.
       */
      timeout?: number
      /**
       * The provider name to use for locking. If no provider is passed, the default provider (in-memory or the provider configuerd in `medusa-config.ts`) will be used.
       */
      provider?: string
    },
    sharedContext?: Context
  ): Promise<T>
  /**
   * This method acquires a lock on the given keys. You can optionally pass a provider name to be used for locking. 
   * If no provider is passed, the default provider (in-memory or the provider configuerd in `medusa-config.ts`) will be used.
   * 
   * You can pass an owner for the lock, which limits who can extend or release the acquired lock. Then, if you use this method again
   * passing the same owner, the lock's expiration time is extended with the value passed in the `expire` argument. Otherwise, if you pass a
   * different owner, the method throws an error.
   * 
   * @param keys - The keys to acquire the lock on.
   * @param args - Additional arguments for acquiring the lock.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns Resolves when the lock is acquired.
   * 
   * @example
   * For example, to acquire a lock on a product with ID `prod_123` for a user with ID `user_123`:
   * 
   * ```ts
   * await lockingModuleService.acquire("prod_123", {
   *   ownerId: "user_123",
   *   expire: 60
   * })
   * ```
   * 
   * In this example, you acquire a lock on the product with ID `prod_123` for the user with ID `user_123`. You extend the 
   * lock's expiration time by `60` seconds.
   * 
   * To specify the provider to use for locking, you can pass the provider name in the `args` argument:
   * 
   * ```ts
   * await lockingModuleService.acquire("prod_123", {
   *   ownerId: "user_123",
   *   expire: 60,
   *   provider: "lp_my-lock"
   * })
   * ```
   */
  acquire(
    keys: string | string[],
    args?: {
      /**
       * The owner ID for the lock. If specified, only the owner can release the lock or extend its expiration time.
       */
      ownerId?: string | null
      /**
       * The expiration time (in seconds) for the lock. If the lock is already acquired and the owner is the same, the expiration time is extended
       * by the value passed. If not specified, the lock does not expire.
       */
      expire?: number
      /**
       * The provider name to use for locking. If no provider is passed, the default provider (in-memory or the provider configuerd in `medusa-config.ts`) will be used.
       */
      provider?: string
    },
    sharedContext?: Context
  ): Promise<void>
  /**
   * This method releases a lock on the given keys. You can optionally pass a provider name to be used for locking.
   * If no provider is passed, the default provider (in-memory or the provider configuerd in `medusa-config.ts`) will be used.
   * 
   * If the lock has an owner, you must pass the same owner to release the lock.
   * 
   * @param keys - The keys to release the lock from.
   * @param args - Additional arguments for releasing the lock.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns Whether the lock was successfully released. If the lock has a different owner than the one passed, the method returns `false`.
   * 
   * @example
   * For example, to release a lock on a product with ID `prod_123` for a user with ID `user_123`:
   * 
   * ```ts
   * await lockingModuleService.release("prod_123", {
   *   ownerId: "user_123"
   * })
   * ```
   * 
   * In this example, you release the lock on the product with ID `prod_123` for the user with ID `user_123`.
   * 
   * To specify the provider to use for locking, you can pass the provider name in the `args` argument:
   * 
   * ```ts
   * await lockingModuleService.release("prod_123", {
   *   ownerId: "user_123",
   *   provider: "lp_my-lock"
   * })
   * ```
   */
  release(
    keys: string | string[],
    args?: {
      /**
       * The ID of the lock's owner. The lock can be released either if it doesn't have an owner, or 
       * if its owner ID matches the one passed in this property.
       */
      ownerId?: string | null
      /**
       * The provider name to use for locking. If no provider is passed, the default provider (in-memory or the provider configuerd in `medusa-config.ts`) will be used.
       */
      provider?: string
    },
    sharedContext?: Context
  ): Promise<boolean>
  /**
   * This method releases all locks. If you specify an owner ID, then all locks that the owner has acquired are released.
   * 
   * You can also pass a provider name to be used for locking. If no provider is passed, the default provider (in-memory or the provider configuerd in `medusa-config.ts`) will be used.
   * 
   * @param args - Additional arguments for releasing the locks.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * 
   * @example
   * For example, to release all locks for a user with ID `user_123`:
   * 
   * ```ts
   * await lockingModuleService.releaseAll({
   *   ownerId: "user_123"
   * })
   * ```
   * 
   * In this example, you release all locks for the user with ID `user_123`.
   * 
   * To specify the provider to use for locking, you can pass the provider name in the `args` argument:
   * 
   * ```ts
   * await lockingModuleService.releaseAll({
   *   ownerId: "user_123",
   *   provider: "lp_my-lock"
   * })
   * ```
   */
  releaseAll(
    args?: {
      /**
       * The ID of a lock owner. If specified, all locks that the owner has acquired are released.
       */
      ownerId?: string | null
      /**
       * The provider name to use for locking. If no provider is passed, the default provider (in-memory or the provider configuerd in `medusa-config.ts`) will be used.
       */
      provider?: string
    },
    sharedContext?: Context
  ): Promise<void>
}
