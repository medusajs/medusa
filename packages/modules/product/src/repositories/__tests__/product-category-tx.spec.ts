import { DALUtils } from "@medusajs/framework/utils"

import { ProductCategoryRepository } from "../product-category"

const tick = () => new Promise<void>((resolve) => setImmediate(resolve))

/**
 * Asserts the recorded events form strict start/end pairs with no
 * interleaving, i.e. [x:start, x:end, y:start, y:end].
 */
const expectSequential = (events: string[]) => {
  expect(events).toHaveLength(4)
  const pairs = [
    [events[0], events[1]],
    [events[2], events[3]],
  ]
  for (const [start, end] of pairs) {
    expect(start.endsWith(":start")).toBe(true)
    expect(end).toBe(start.replace(":start", ":end"))
  }
}

describe("ProductCategoryRepository.create", () => {
  const setup = () => {
    const events: string[] = []
    let seq = 0
    const manager = {
      count: jest.fn(async () => {
        events.push("count:start")
        await tick()
        events.push("count:end")
        return 5
      }),
      findOne: jest.fn(async () => ({ id: "pc_x", mpath: "pc_x" })),
      create: jest.fn(async (_entity: string, data: any) => ({
        id: `pc_test_${seq++}`,
        ...data,
      })),
      assign: jest.fn((entity: any, data: any) =>
        Object.assign(entity, data)
      ),
      persist: jest.fn(),
    }

    const Base = (DALUtils as any).MikroOrmBaseTreeRepository
    const original = Base.prototype.getActiveManager
    Base.prototype.getActiveManager = () => manager

    const repo = Object.create(
      ProductCategoryRepository.prototype
    ) as ProductCategoryRepository
    repo.rerankSiblingsAfterCreation = jest.fn()

    return {
      repo,
      manager,
      events,
      restore: () => {
        Base.prototype.getActiveManager = original
      },
    }
  }

  it("runs the per-entry queries sequentially instead of interleaved", async () => {
    const { repo, events, restore } = setup()
    try {
      // Different parents so the sibling count is queried once per parent.
      await repo.create(
        [{ name: "a" }, { name: "b", parent_category_id: "pc_x" }] as any,
        {}
      )
      expectSequential(events)
    } finally {
      restore()
    }
  })

  it("keeps batch ranks stable (siblings count + index)", async () => {
    const { repo, restore } = setup()
    try {
      const created = await repo.create(
        [{ name: "a" }, { name: "b" }] as any,
        {}
      )
      expect(created[0].rank).toBe(5)
      expect(created[1].rank).toBe(6)
    } finally {
      restore()
    }
  })
})
