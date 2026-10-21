import {
  LoadStrategy,
  raw,
  RawQueryFragment,
} from "@medusajs/framework/mikro-orm/core"
import { Order } from "@models"
import { setFindMethods } from "../../utils/base-repository-find"

class TestOrderRepository {
  entity = {
    name: "Order",
    meta: { primaryKeys: ["id"], className: "Order" },
  }
  tableName = "order"

  getActiveManager(context?: { manager?: unknown }) {
    return context?.manager
  }
}

setFindMethods(TestOrderRepository, Order)

/**
 * MikroORM drops a raw fragment from its cache the first time a query reads
 * it. These mocks do the same, so a shared `where` fails the second query
 * the way `manager.find` + `manager.count` do.
 */
function consumeRawFragments(
  value: unknown,
  missing: string[],
  found: RawQueryFragment[]
) {
  if (Array.isArray(value)) {
    for (const entry of value) {
      consumeRawFragments(entry, missing, found)
    }
    return
  }

  if (
    value === null ||
    typeof value !== "object" ||
    Object.getPrototypeOf(value) !== Object.prototype
  ) {
    return
  }

  const record = value as Record<string, unknown>

  for (const key of Object.keys(record)) {
    if (key.startsWith("[raw]:")) {
      const fragment = RawQueryFragment.getKnownFragment(key)
      if (!fragment) {
        missing.push(key)
      } else {
        found.push(fragment)
      }
    }

    consumeRawFragments(record[key], missing, found)
  }
}

function createManager() {
  const missing: string[] = []
  const found: RawQueryFragment[] = []
  const calls: { findWhere?: unknown; countWhere?: unknown } = {}

  const manager = {
    getKnex: () => ({
      raw: (sql: string) => ({ sql }),
    }),
    getDriver: () => ({
      getMetadata: () => ({
        get: () => undefined,
      }),
    }),
    find: async (_entity: unknown, where: unknown) => {
      consumeRawFragments(where, missing, found)
      calls.findWhere = where
      return [{ id: "order_1" }]
    },
    count: async (_entity: unknown, where: unknown) => {
      consumeRawFragments(where, missing, found)
      calls.countWhere = where
      return 1
    },
  }

  return { manager, missing, found, calls }
}

describe("OrderRepository.findAndCount", () => {
  it("keeps a cross-module raw filter usable by both the page query and the count", async () => {
    const { manager, missing, found, calls } = createManager()
    const repository = new TestOrderRepository()
    const sellerFilter = raw(
      "exists (select 1 from order_order_seller_seller as cm_link_0 where cm_link_0.order_id = o0.id and cm_link_0.seller_id = ?)",
      ["sel_123"]
    )

    const [orders, count] = await repository.findAndCount(
      {
        where: {
          $and: [{ email: "retail@example.com" }, { [sellerFilter]: [] }],
        },
        options: { strategy: LoadStrategy.JOINED },
      },
      { manager }
    )

    expect(missing).toEqual([])
    expect(found.map((fragment) => fragment.params)).toEqual([
      ["sel_123"],
      ["sel_123"],
    ])
    expect(count).toBe(1)
    expect(orders).toEqual([{ id: "order_1" }])
    expect(calls.countWhere).not.toBe(calls.findWhere)
  })
})
