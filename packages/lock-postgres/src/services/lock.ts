import { EntityManager, getConnection } from "typeorm"
import { ILockService } from "@medusajs/medusa"

import { CONNECTION_NAME } from "../config"

export default class LockService implements ILockService {
  private dbName = "lock_service"
  protected manager_: EntityManager
  constructor() {
    this.manager_ = getConnection(CONNECTION_NAME).manager

    void this.manager_.query(`
		CREATE TABLE IF NOT EXISTS ${this.dbName} (
			id CHARACTER VARYING NOT NULL,
			owner_id CHARACTER VARYING NULL,
			expiration TIMESTAMP WITH TIME ZONE,
			PRIMARY KEY (id)
		);
	`)
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

  async execute<T>(
    key: string,
    job: () => Promise<T>,
    timeoutSeconds = 5
  ): Promise<T> {
    const numKey = this.hashStringToInt(key)

    return await this.manager_.transaction(async (manager) => {
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
    const [row] = await this.manager_.query(
      `SELECT owner_id, expire, now() AS now FROM ${this.dbName} WHERE id = $1`,
      [key]
    )

    if (!row) {
      const expireSql = expire && ", NOW() + INTERVAL '${expire} SECONDS'"
      await this.manager_.query(
        `INSERT INTO ${this.dbName} (id, owner_id, expire) VALUES ($1, $2 ${expireSql})`,
        [key, ownerId ?? null]
      )
      return
    }

    if (!row.expire || row.expire > row.now) {
      return
    }

    if (row.owner_id == ownerId) {
      if (expire) {
        await this.manager_.query(
          `UPDATE ${this.dbName} SET expire = NOW() + INTERVAL '${expire} SECONDS' VALUES ($1, $2, $3)`,
          [key]
        )
      }

      throw new Error(`"${key}" is already locked.`)
    }
  }

  async release(key: string, ownerId: string): Promise<boolean> {
    const [row] = await this.manager_.query(
      `SELECT owner_id, expire, now() AS now FROM ${this.dbName} WHERE id = $1`,
      [key]
    )

    if (!row || row.owner_id != ownerId) {
      return false
    }

    await this.manager_.query(`DELETE FROM ${this.dbName} WHERE id = $1`, [key])

    return !row.expire || row.expire > row.now
  }

  async releaseAll(): Promise<void> {
    await this.manager_.query(`TRUNCATE TABLE ${this.dbName}`)
  }
}
