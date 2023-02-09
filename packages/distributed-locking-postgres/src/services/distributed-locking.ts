import { EntityManager } from "typeorm"
import {
  IDistributedLockingService,
  TransactionBaseService,
} from "@medusajs/medusa"

export default class DistributedLockingService
  extends TransactionBaseService
  implements IDistributedLockingService
{
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
  constructor() {
    // @ts-ignore
    super(...arguments)
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
      `SELECT owner_id, expire, now() AS now FROM distributed_locking WHERE id = $1`,
      [key]
    )

    if (!row) {
      const expireSql = expire && ", NOW() + INTERVAL '${+expire} SECONDS'"
      await this.getManager().query(
        `INSERT INTO distributed_locking (id, owner_id, expire) VALUES ($1, $2 ${expireSql})`,
        [key, ownerId ?? null]
      )
      return
    }

    if (!row.expire || row.expire > row.now) {
      return
    }

    if (row.owner_id == ownerId) {
      if (expire) {
        await this.getManager().query(
          `UPDATE distributed_locking SET expire = NOW() + INTERVAL '${+expire} SECONDS' WHERE id = $1`,
          [key]
        )
      }

      throw new Error(`"${key}" is already locked.`)
    }
  }

  async release(key: string, ownerId: string): Promise<boolean> {
    const [row] = await this.getManager().query(
      `SELECT owner_id, expire, now() AS now FROM distributed_locking WHERE id = $1`,
      [key]
    )

    if (!row || row.owner_id != ownerId) {
      return false
    }

    await this.getManager().query(
      `DELETE FROM distributed_locking WHERE id = $1`,
      [key]
    )

    return !row.expire || row.expire > row.now
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
