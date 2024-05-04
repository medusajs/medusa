import {
  DAL,
  ILockingService,
  InternalModuleDeclaration,
} from "@medusajs/types"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
}

export default class LockingModuleService implements ILockingService {
  protected baseRepository_: DAL.RepositoryService

  constructor(
    { baseRepository }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
  }

  private getDriver() {
    return (this.baseRepository_ as any).getEntityManager().getDriver()
  }

  async execute<T>(
    key: string,
    job: () => Promise<T>,
    timeoutSeconds = 5
  ): Promise<T> {
    const numKey = this.hashStringToInt(key)

    return await this.getDriver().transaction(async (manager) => {
      const ops: Promise<unknown>[] = []
      if (timeoutSeconds > 0) {
        ops.push(this.getTimeout(timeoutSeconds))
      }

      const fnName = "pg_advisory_xact_lock"
      const lock = new Promise((ok, nok) => {
        manager
          .execute(`SELECT ${fnName}($1)`, [numKey])
          .then((rs) => ok(rs[0][fnName]))
          .catch((err) => nok(err))
      })
      ops.push(lock)

      await Promise.race(ops)

      return await job()
    })
  }

  async acquire(key: string, ownerId?: string, expire?: number): Promise<void> {
    const [row] = await this.getDriver().execute(
      `SELECT owner_id, expiration, now() AS now FROM distributed_locking WHERE id = $1`,
      [key]
    )

    if (!row) {
      const expireSql = expire
        ? "NOW() + INTERVAL '${+expire} SECONDS'"
        : "NULL"
      await this.getDriver().execute(
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

      await this.getDriver().execute(
        `UPDATE distributed_locking SET owner_id = $2 ${expireSql} WHERE id = $1`,
        [key, ownerId ?? null]
      )
      return
    } else if (row.owner_id !== ownerId) {
      throw new Error(`"${key}" is already locked.`)
    }
  }

  async release(key: string, ownerId: string): Promise<boolean> {
    const [row] = await this.getDriver().execute(
      `SELECT owner_id, expiration, now() AS now FROM distributed_locking WHERE id = $1`,
      [key]
    )

    if (!row || row.owner_id != ownerId) {
      return false
    }

    await this.getDriver().execute(
      `DELETE FROM distributed_locking WHERE id = $1`,
      [key]
    )

    return !row.expiration || row.expiration > row.now
  }

  async releaseAll(ownerId?: string): Promise<void> {
    if (typeof ownerId === "undefined") {
      await this.getDriver().execute(`TRUNCATE TABLE distributed_locking`)
    } else {
      await this.getDriver().execute(
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
