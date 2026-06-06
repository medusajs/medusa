import { ILockingModule, Logger } from "@zjedene-medusa/types"

export class Orchestrator {
  /**
   * Reference to the locking module
   */
  #lockingModule: ILockingModule

  /**
   * Reference to the logger
   */
  #logger: Logger

  /**
   * Owner id when acquiring locks
   */
  #lockingOwner = `index-sync-${process.pid}`

  /**
   * The current state of the orchestrator
   *
   * - In "idle" state, one can call the "run" method.
   * - In "processing" state, the orchestrator is looping over the entities
   *   and processing them.
   * - In "completed" state, the provided entities have been processed.
   * - The "error" state is set when the task runner throws an error.
   */
  #state: "idle" | "processing" | "completed" | "error" = "idle"

  /**
   * Options for the locking module and the task runner to execute the
   * task.
   *
   * - Lock duration is the maximum duration for which to hold the lock.
   *   After this the lock will be removed.
   *
   *   The entity is provided to the taskRunner only when the orchestrator
   *   is able to acquire a lock.
   */
  #options: {
    lockDuration: number
  }

  /**
   * Index of the entity that is currently getting processed.
   */
  #currentIndex: number = 0

  /**
   * Collection of entities to process in sequence. A lock is obtained
   * while an entity is getting synced to avoid multiple processes
   * from syncing the same entity
   */
  #entities: string[] = []

  /**
   * The current state of the orchestrator
   */
  get state() {
    return this.#state
  }

  /**
   * Reference to the currently processed entity
   */
  get current() {
    return this.#entities[this.#currentIndex]
  }

  /**
   * Reference to the number of entities left for processing
   */
  get remainingCount() {
    return this.#entities.length - (this.#currentIndex + 1)
  }

  constructor(
    lockingModule: ILockingModule,
    entities: string[],
    options: {
      lockDuration: number
      logger: Logger
    }
  ) {
    this.#lockingModule = lockingModule
    this.#entities = entities
    this.#options = options
    this.#logger = options.logger
  }

  /**
   * Acquires using the lock module.
   */
  async #acquireLock(forKey: string): Promise<boolean> {
    try {
      await this.#lockingModule.acquire(forKey, {
        expire: this.#options.lockDuration,
        ownerId: this.#lockingOwner,
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * Acquires or renew the lock for a given key.
   */
  async renewLock(forKey: string): Promise<boolean> {
    return this.#acquireLock(forKey)
  }

  /**
   * Processes the entity. If there are no entities
   * left, the orchestrator state will be set to completed.
   *
   * - Task runner is the implementation function to execute a task.
   *   Orchestrator has no inbuilt execution logic and it relies on
   *   the task runner for the same.
   */
  async #processEntity(
    taskRunner: (entity: string) => Promise<void>,
    entity: string
  ) {
    const lockAcquired = await this.#acquireLock(entity)
    if (lockAcquired) {
      try {
        await taskRunner(entity)
      } catch (error) {
        this.#state = "error"
        throw error
      } finally {
        await this.#lockingModule
          .release(entity, {
            ownerId: this.#lockingOwner,
          })
          .catch(() => {
            this.#logger.error(
              `[Index engine] failed to release lock for entity '${entity}'`
            )
          })
      }
    } else {
      this.#logger.warn(
        `[Index engine] failed to acquire lock for entity '${entity}' on pid ${process.pid}. It means another process is already processing this entity or a lock is still present in your locking provider.`
      )
    }
  }

  /**
   * Run the orchestrator to process the entities one by one.
   *
   * - Task runner is the implementation function to execute a task.
   *   Orchestrator has no inbuilt execution logic and it relies on
   *   the task runner for the same.
   */
  async process(taskRunner: (entity: string) => Promise<void>) {
    if (this.state !== "idle") {
      throw new Error("Cannot re-run an already running orchestrator instance")
    }

    this.#state = "processing"

    for (let i = 0; i < this.#entities.length; i++) {
      this.#currentIndex = i
      const entity = this.#entities[i]
      if (!entity) {
        this.#state = "completed"
        break
      }

      await this.#processEntity(taskRunner, entity)
    }

    this.#state = "completed"
  }
}
