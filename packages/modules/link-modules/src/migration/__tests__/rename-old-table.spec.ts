import { PlannerActionLinkDescriptor } from "@medusajs/framework/types"
import { MikroORM } from "@medusajs/framework/mikro-orm/core"
import { PostgreSqlDriver } from "@medusajs/framework/mikro-orm/postgresql"
import { MigrationsExecutionPlanner } from "../index"

class TestablePlanner extends MigrationsExecutionPlanner {
  async testRenameOldTable(
    orm: MikroORM<PostgreSqlDriver>,
    oldName: string,
    newName: string,
    descriptor: PlannerActionLinkDescriptor
  ) {
    return this.renameOldTable(orm, oldName, newName, descriptor)
  }
}

describe("MigrationsExecutionPlanner.renameOldTable", () => {
  let planner: TestablePlanner
  let capturedSQL: string

  beforeEach(() => {
    capturedSQL = ""
    planner = new TestablePlanner([], {
      database: { clientUrl: "postgres://localhost:5432/test_db" },
    })
  })

  function makeMockOrm(): MikroORM<PostgreSqlDriver> {
    return {
      em: {
        getDriver: () => ({
          getConnection: () => ({
            execute: async (sql: string) => {
              capturedSQL = sql
            },
          }),
        }),
      },
    } as unknown as MikroORM<PostgreSqlDriver>
  }

  const descriptor: PlannerActionLinkDescriptor = {
    fromModule: "order",
    toModule: "payout",
    fromModel: "order",
    toModel: "payout",
  }

  it("should use an unqualified identifier as the RENAME TO target", async () => {
    await planner.testRenameOldTable(
      makeMockOrm(),
      "order_payout",
      "order_order_payout_payout",
      descriptor
    )

    // PostgreSQL grammar requires an unqualified name after RENAME TO.
    // A schema-qualified target ("public"."new_name") causes ERROR 42601.
    expect(capturedSQL).toMatch(/RENAME TO "order_order_payout_payout"/)
    expect(capturedSQL).not.toMatch(
      /RENAME TO "public"\."order_order_payout_payout"/
    )
  })

  it("should schema-qualify the source table in ALTER TABLE", async () => {
    await planner.testRenameOldTable(
      makeMockOrm(),
      "order_payout",
      "order_order_payout_payout",
      descriptor
    )

    expect(capturedSQL).toMatch(/ALTER TABLE "public"\."order_payout"/)
  })

  it("should update the tracking table entry to the new name", async () => {
    await planner.testRenameOldTable(
      makeMockOrm(),
      "order_payout",
      "order_order_payout_payout",
      descriptor
    )

    expect(capturedSQL).toMatch(/SET table_name = 'order_order_payout_payout'/)
    expect(capturedSQL).toMatch(/WHERE table_name = 'order_payout'/)
  })
})
