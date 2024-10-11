import { ILockingProvider } from "@medusajs/framework/types"
import { isDefined, MedusaService } from "@medusajs/framework/utils"
import { EntityManager } from "@mikro-orm/core"
import { Locking } from "@models"

type InjectedDependencies = {
  manager: EntityManager
}

export class PostgresAdvisoryLockProvider
  extends MedusaService({ Locking })
  implements ILockingProvider
{
  static identifier = "locking-postgres"

  protected manager: EntityManager

  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.manager = container.manager
  }

  private getManager(): any {
    return this.manager
  }

  async execute<T>(
    keys: string | string[],
    job: () => Promise<T>,
    args?: {
      timeout?: number
    }
  ): Promise<T> {
    const timeout = Math.max(args?.timeout ?? 5, 1)
    const timeoutSeconds = Number.isNaN(timeout) ? 1 : timeout
    if (timeoutSeconds <= 0) {
      throw new Error("Locking.execute timeout must be greater than 0.")
    }

    const release = async (manager, numKeys) => {
      const fnName = "pg_advisory_unlock"
      const unlockPromises = numKeys.map((numKey) =>
        manager.execute(`SELECT ${fnName}(?)`, [numKey])
      )
      return Promise.all(unlockPromises)
    }

    const manager = this.getManager()

    const ops: Promise<unknown>[] = []
    if (timeoutSeconds > 0) {
      ops.push(this.getTimeout(timeoutSeconds))
    }

    const fnName = "pg_advisory_lock"

    keys = Array.isArray(keys) ? keys : [keys]

    const numKeys = keys.map(this.hashStringToInt)
    const lockPromises = numKeys.map((numKey) =>
      manager.execute(
        `
          SET lock_timeout = ?;
          SELECT ${fnName}(?);
        `,
        [timeoutSeconds + "s", numKey]
      )
    )
    const lock = Promise.all(lockPromises)

    ops.push(lock)

    const err = await Promise.race(ops).catch((err) => err)

    if (err instanceof Error) {
      await release(manager, numKeys)
      throw err
    }

    try {
      console.log("pass")
      return await job()
    } catch (e) {
      throw e
    } finally {
      await release(manager, numKeys)
    }
  }

  private async loadLock(key: string): Promise<{
    owner_id: string | null
    expiration: number | null
    now: number
  }> {
    const [row] = await this.getManager().execute(
      `SELECT owner_id, expiration, NOW() AS now FROM locking WHERE id = ?`,
      [key]
    )

    return row
  }

  async acquire(
    keys: string | string[],
    args?: {
      ownerId?: string | null
      expire?: number
    }
  ): Promise<void> {
    keys = Array.isArray(keys) ? keys : [keys]

    const { ownerId, expire } = args ?? {}
    for (const key of keys) {
      const row = await this.loadLock(key)

      if (!row) {
        const expireSql = expire
          ? `NOW() + INTERVAL '${+expire} SECONDS'`
          : "NULL"

        try {
          await this.getManager().execute(
            `INSERT INTO locking (id, owner_id, expiration) VALUES (?, ?, ${expireSql})`,
            [key, ownerId ?? null]
          )
        } catch (err) {
          if (err.toString().includes("locking_pkey")) {
            const owner = await this.loadLock(key)
            if (ownerId != owner.owner_id) {
              throw new Error(`"${key}" is already locked.`)
            }
          } else {
            throw err
          }
        }
        continue
      }

      if (row.owner_id !== ownerId) {
        throw new Error(`"${key}" is already locked.`)
      }

      if (!row.expiration && row.owner_id == ownerId) {
        continue
      }

      const canRefresh =
        row.owner_id == ownerId && (expire || row.expiration! <= row.now)

      if (!canRefresh || !expire) {
        continue
      }

      await this.getManager().execute(
        `UPDATE locking SET owner_id = ?, expiration = NOW() + INTERVAL '${+expire} SECONDS' WHERE id = ?`,
        [ownerId ?? null, key]
      )
    }
  }

  async release(
    keys: string | string[],
    args?: {
      ownerId?: string | null
    }
  ): Promise<boolean> {
    const { ownerId } = args ?? {}

    keys = Array.isArray(keys) ? keys : [keys]

    let success = true
    for (const key of keys) {
      const row = await this.loadLock(key)

      if (!row || row.owner_id != ownerId) {
        success = false
        continue
      }

      await this.getManager().execute(`DELETE FROM locking WHERE id = ?`, [key])

      success = success && (!row.expiration || row.expiration > row.now)
    }
    return success
  }

  async releaseAll(args?: { ownerId?: string | null }): Promise<void> {
    const { ownerId } = args ?? {}

    if (!isDefined(ownerId)) {
      await this.getManager().execute(`TRUNCATE TABLE locking`)
    } else {
      await this.getManager().execute(
        `DELETE FROM locking WHERE owner_id = ?`,
        [ownerId]
      )
    }
  }

  private hashStringToInt(str: string): number {
    let hash = 5381
    for (let i = str.length; i--; ) {
      hash = (hash * 33) ^ str.charCodeAt(i)
    }
    return hash >>> 0
  }

  private async getTimeout(seconds: number): Promise<Error> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("Timed-out acquiring lock."))
      }, seconds * 1000)
    })
  }
}
