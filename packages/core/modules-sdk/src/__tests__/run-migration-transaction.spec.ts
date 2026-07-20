import { MedusaError } from "@medusajs/utils"
import { runMigrationTransaction } from "../medusa-app"

describe("runMigrationTransaction", () => {
  afterEach(() => {
    delete process.env.MEDUSA_DB_MIGRATION_CONNECTION_TIMEOUT
  })

  it("runs the work and resolves when the transaction opens", async () => {
    const trx = { raw: jest.fn().mockResolvedValue(undefined) }
    const knex = {
      transaction: jest.fn(async (cb: (trx: any) => Promise<void>) => {
        await cb(trx)
      }),
    }
    const work = jest.fn().mockResolvedValue(undefined)

    await expect(
      runMigrationTransaction(knex as any, work)
    ).resolves.toBeUndefined()

    expect(work).toHaveBeenCalledWith(trx)
  })

  it("throws an actionable error when opening the transaction hangs", async () => {
    process.env.MEDUSA_DB_MIGRATION_CONNECTION_TIMEOUT = "50"

    const knex = {
      // Simulates a transaction open that never enters the callback.
      transaction: jest.fn().mockReturnValue(new Promise(() => {})),
    }
    const work = jest.fn()

    const error = await runMigrationTransaction(knex as any, work).catch(
      (e) => e
    )

    expect(error).toBeInstanceOf(MedusaError)
    expect(error.type).toEqual(MedusaError.Types.DB_ERROR)
    expect(error.message).toContain("Timed out")
    expect(error.message).toContain("opening the migration transaction")
    expect(error.message).toContain(
      "https://docs.medusajs.com/resources/troubleshooting/database-errors"
    )
    expect(work).not.toHaveBeenCalled()
  })

  it("does not time out a long-running migration once the transaction is open", async () => {
    process.env.MEDUSA_DB_MIGRATION_CONNECTION_TIMEOUT = "50"

    const trx = {}
    const knex = {
      transaction: jest.fn(async (cb: (trx: any) => Promise<void>) => {
        await cb(trx)
      }),
    }
    // Work that takes longer than the open timeout must still complete.
    const work = jest.fn(
      () => new Promise<void>((resolve) => setTimeout(resolve, 150))
    )

    await expect(
      runMigrationTransaction(knex as any, work)
    ).resolves.toBeUndefined()

    expect(work).toHaveBeenCalledTimes(1)
  })

  it("propagates errors thrown by the migration work", async () => {
    const trx = {}
    const knex = {
      transaction: jest.fn(async (cb: (trx: any) => Promise<void>) => {
        await cb(trx)
      }),
    }
    const work = jest.fn().mockRejectedValue(new Error("migration failed"))

    const error = await runMigrationTransaction(knex as any, work).catch(
      (e) => e
    )

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toEqual("migration failed")
  })
})
