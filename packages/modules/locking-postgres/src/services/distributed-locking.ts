import { EntityManager } from "typeorm"
import {
  ConfigurableModuleDeclaration,
  IDistributedLockingService,
  MODULE_RESOURCE_TYPE,
  TransactionBaseService,
} from "@medusajs/medusa"
import { MedusaError } from "medusa-core-utils"

type InjectedDependencies = {
  manager: EntityManager
}

export default class DistributedLockingService
  extends TransactionBaseService
  implements IDistributedLockingService
{
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
  constructor(
    { manager }: InjectedDependencies,
    options?: unknown,
    moduleDeclaration?: ConfigurableModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    if (moduleDeclaration?.resources !== MODULE_RESOURCE_TYPE.SHARED) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "At the moment this module can only be used with shared resources"
      )
    }

    this.manager_ = manager
  }

  private getManager(): EntityManager {
    return this.transactionManager_ ?? this.manager_
  }

  async execute<T>(
    key: string,
    job: () => Promise<T>,
    timeoutSeconds = 5
  ): Promise<T> {
    const numKey = this.hashStringToInt(key)

    return await this.getManager().transaction(async (manager) => {
      const ops: Promise<unknown>[] = []
      if (timeoutSeconds > 0) {
        ops.push(this.getTimeout(timeoutSeconds))
      }

      const fnName = "pg_advisory_xact_lock"
      const lock = new Promise((ok, nok) => {
        manager
          .query(`SELECT ${fnName}($1)`, [numKey])
          .then((rs) => ok(rs[0][fnName]))
          .catch((err) => nok(err))
      })
      ops.push(lock)

      await Promise.race(ops)

      return await job()
    })
  }

  async acquire(key: string, ownerId?: string, expire?: number): Promise<void> {
    const [row] = await this.getManager().query(
      `SELECT owner_id, expiration, now() AS now FROM distributed_locking WHERE id = $1`,
      [key]
    )

    if (!row) {
      const expireSql = expire
        ? "NOW() + INTERVAL '${+expire} SECONDS'"
        : "NULL"
      await this.getManager().query(
        `INSERT INTO distributed_locking (id, owner_id, expiration) VALUES ($1, $2, ${expireSql})`,
        [key, ownerId ?? null]
      )
      return
    }

    if (!row.expiration && row.owner_id == ownerId) {
      return
    }

    const refresh =
      row.owner_id == ownerId && (expire || row.expiration <= row.now)

    if (refresh) {
      const expireSql = expire
        ? ", expiration = NOW() + INTERVAL '${+expire} SECONDS'"
        : ""

      await this.getManager().query(
        `UPDATE distributed_locking SET owner_id = $2 ${expireSql} WHERE id = $1`,
        [key, ownerId ?? null]
      )
      return
    } else if (row.owner_id !== ownerId) {
      throw new Error(`"${key}" is already locked.`)
    }
  }

  async release(key: string, ownerId: string): Promise<boolean> {
    const [row] = await this.getManager().query(
      `SELECT owner_id, expiration, now() AS now FROM distributed_locking WHERE id = $1`,
      [key]
    )

    if (!row || row.owner_id != ownerId) {
      return false
    }

    await this.getManager().query(
      `DELETE FROM distributed_locking WHERE id = $1`,
      [key]
    )

    return !row.expiration || row.expiration > row.now
  }

  async releaseAll(ownerId?: string): Promise<void> {
    if (typeof ownerId === "undefined") {
      await this.getManager().query(`TRUNCATE TABLE distributed_locking`)
    } else {
      await this.getManager().query(
        `DELETE FROM distributed_locking WHERE owner_id = $1`,
        [ownerId]
      )
    }
  }

  private hashStringToInt(str): number {
    let hash = 5381
    for (let i = str.length; i--; ) {
      hash = (hash * 33) ^ str.charCodeAt(i)
    }
    return hash >>> 0
  }

  private async getTimeout(seconds): Promise<void> {
    return new Promise((ok, nok) => {
      setTimeout(() => {
        nok(new Error("Timed-out acquiring lock."))
      }, seconds * 1000)
    })
  }
}
