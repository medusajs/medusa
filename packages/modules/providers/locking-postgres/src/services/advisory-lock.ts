import { ILockingProvider } from "@medusajs/framework/types"
import { isDefined } from "@medusajs/utils"
import { EntityManager } from "@mikro-orm/core"

type InjectedDependencies = {
  manager: EntityManager
}

export class PostgresAdvisoryLockProvider implements ILockingProvider {
  static identifier = "postgres-advisory-lock"
  static PROVIDER = "postgres-advisory-lock"

  protected manager: EntityManager

  constructor({ manager }: InjectedDependencies) {
    this.manager = manager
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
    keys = Array.isArray(keys) ? keys : [keys]

    const timeoutSeconds = args?.timeout ?? 5

    return await this.getManager().transactional(async (manager) => {
      const ops: Promise<unknown>[] = []
      if (timeoutSeconds > 0) {
        ops.push(this.getTimeout(timeoutSeconds))
      }

      const fnName = "pg_advisory_xact_lock"

      const numKeys = keys.map(this.hashStringToInt)
      const lockPromises = numKeys.map((numKey) =>
        manager.execute(`SELECT ${fnName}(?)`, [numKey])
      )

      const lock = Promise.all(lockPromises)

      ops.push(lock)

      await Promise.race(ops)

      return await job()
    })
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
    ownerId: string | null = null
  ): Promise<boolean> {
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

  async releaseAll(ownerId: string | null = null): Promise<void> {
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

  private async getTimeout(seconds: number): Promise<void> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Timed-out acquiring lock."))
      }, seconds * 1000)
    })
  }
}
