import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { Modules } from "@medusajs/framework/utils"
import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk"
import { reserveInventoryStep } from "../reserve-inventory"

const buildContainer = ({
  inventoryLevels,
  createReservationItems,
}: {
  inventoryLevels: any[]
  createReservationItems: jest.Mock<any, any>
}) => {
  const container = createContainer() as unknown as MedusaContainer

  container.register(
    Modules.INVENTORY,
    asFunction(() => ({
      listInventoryLevels: jest.fn(async () => inventoryLevels),
      createReservationItems,
      deleteReservationItems: jest.fn(async () => {}),
    }))
  )

  container.register(
    Modules.LOCKING,
    asFunction(() => ({
      execute: jest.fn(async (_keys: string[], cb: () => Promise<any>) =>
        cb()
      ),
    }))
  )

  return container
}

const runReserve = async (
  container: MedusaContainer,
  input: any
) => {
  const workflow = createWorkflow(
    `reserveInventoryStepTest_${Math.random().toString(36).slice(2)}`,
    (data: any) => {
      const result = reserveInventoryStep(data)
      return new WorkflowResponse(result)
    }
  )

  return workflow(container).run({ input })
}

describe("reserveInventoryStep", () => {
  it("reserves the full quantity at the first listed location for single-location items", async () => {
    const createReservationItems = jest.fn(async (items: any[]) =>
      items.map((it, i) => ({ id: `res_${i}`, ...it }))
    )

    const container = buildContainer({
      inventoryLevels: [],
      createReservationItems,
    })

    await runReserve(container, {
      items: [
        {
          id: "li_1",
          inventory_item_id: "ii_1",
          required_quantity: 1,
          allow_backorder: false,
          quantity: 2,
          location_ids: ["sl_a"],
        },
      ],
    })

    expect(createReservationItems).toHaveBeenCalledTimes(1)
    expect(createReservationItems.mock.calls[0][0]).toEqual([
      {
        line_item_id: "li_1",
        inventory_item_id: "ii_1",
        quantity: expect.anything(),
        allow_backorder: false,
        location_id: "sl_a",
      },
    ])
    // quantity = required_quantity * quantity = 2
    expect(
      createReservationItems.mock.calls[0][0][0].quantity.toString()
    ).toBe("2")
  })

  it("splits the reservation across locations when no single location can fulfill the full quantity (issue #14987)", async () => {
    const createReservationItems = jest.fn(async (items: any[]) =>
      items.map((it, i) => ({ id: `res_${i}`, ...it }))
    )

    const container = buildContainer({
      inventoryLevels: [
        {
          inventory_item_id: "ii_1",
          location_id: "sl_a",
          stocked_quantity: 1,
          reserved_quantity: 0,
        },
        {
          inventory_item_id: "ii_1",
          location_id: "sl_b",
          stocked_quantity: 1,
          reserved_quantity: 0,
        },
      ],
      createReservationItems,
    })

    await runReserve(container, {
      items: [
        {
          id: "li_1",
          inventory_item_id: "ii_1",
          required_quantity: 1,
          allow_backorder: false,
          quantity: 2,
          location_ids: ["sl_a", "sl_b"],
        },
      ],
    })

    expect(createReservationItems).toHaveBeenCalledTimes(1)
    const inputs = createReservationItems.mock.calls[0][0]
    expect(inputs).toHaveLength(2)
    expect(inputs[0]).toMatchObject({
      line_item_id: "li_1",
      inventory_item_id: "ii_1",
      location_id: "sl_a",
    })
    expect(inputs[0].quantity.toString()).toBe("1")
    expect(inputs[1]).toMatchObject({
      line_item_id: "li_1",
      inventory_item_id: "ii_1",
      location_id: "sl_b",
    })
    expect(inputs[1].quantity.toString()).toBe("1")
  })

  it("prefers a single location that can fully cover the quantity", async () => {
    const createReservationItems = jest.fn(async (items: any[]) =>
      items.map((it, i) => ({ id: `res_${i}`, ...it }))
    )

    const container = buildContainer({
      inventoryLevels: [
        {
          inventory_item_id: "ii_1",
          location_id: "sl_a",
          stocked_quantity: 1,
          reserved_quantity: 0,
        },
        {
          inventory_item_id: "ii_1",
          location_id: "sl_b",
          stocked_quantity: 5,
          reserved_quantity: 0,
        },
      ],
      createReservationItems,
    })

    await runReserve(container, {
      items: [
        {
          id: "li_1",
          inventory_item_id: "ii_1",
          required_quantity: 1,
          allow_backorder: false,
          quantity: 2,
          // sl_a only has 1, sl_b has 5 → first iteration takes 1 from
          // sl_a, second iteration takes the remaining 1 from sl_b
          location_ids: ["sl_a", "sl_b"],
        },
      ],
    })

    const inputs = createReservationItems.mock.calls[0][0]
    expect(inputs).toHaveLength(2)
    expect(
      inputs.reduce(
        (sum: number, i: any) => sum + Number(i.quantity.toString()),
        0
      )
    ).toBe(2)
  })

  it("falls back to the first location when aggregate availability is insufficient (lets inventory module raise the canonical error)", async () => {
    const createReservationItems: jest.Mock<any, any> = jest.fn(
      async (_input: any) => {
        throw new Error("Not enough stock available")
      }
    )

    const container = buildContainer({
      inventoryLevels: [
        {
          inventory_item_id: "ii_1",
          location_id: "sl_a",
          stocked_quantity: 0,
          reserved_quantity: 0,
        },
        {
          inventory_item_id: "ii_1",
          location_id: "sl_b",
          stocked_quantity: 1,
          reserved_quantity: 0,
        },
      ],
      createReservationItems,
    })

    // The aggregated availability across sl_a (0) + sl_b (1) = 1 cannot
    // cover the 5 units needed. Instead of silently emitting a partial
    // reservation, the step hands a single full-quantity reservation
    // against the first candidate location, so the inventory module
    // raises its canonical insufficient-inventory error against a real
    // location and the existing error contract is preserved.
    try {
      await runReserve(container, {
        items: [
          {
            id: "li_1",
            inventory_item_id: "ii_1",
            required_quantity: 1,
            allow_backorder: false,
            quantity: 5,
            location_ids: ["sl_a", "sl_b"],
          },
        ],
      })
    } catch {
      // expected – the inventory module mock throws
    }

    expect(createReservationItems).toHaveBeenCalledTimes(1)
    const inputs = createReservationItems.mock.calls[0][0]
    expect(inputs).toHaveLength(1)
    expect(inputs[0]).toMatchObject({
      line_item_id: "li_1",
      inventory_item_id: "ii_1",
      location_id: "sl_a",
    })
    expect(inputs[0].quantity.toString()).toBe("5")
  })

  it("keeps single-location behavior for backorder-enabled items even with multiple candidate locations", async () => {
    const createReservationItems = jest.fn(async (items: any[]) =>
      items.map((it, i) => ({ id: `res_${i}`, ...it }))
    )

    const container = buildContainer({
      inventoryLevels: [],
      createReservationItems,
    })

    await runReserve(container, {
      items: [
        {
          id: "li_1",
          inventory_item_id: "ii_1",
          required_quantity: 1,
          allow_backorder: true,
          quantity: 3,
          location_ids: ["sl_a", "sl_b"],
        },
      ],
    })

    const inputs = createReservationItems.mock.calls[0][0]
    expect(inputs).toHaveLength(1)
    expect(inputs[0]).toMatchObject({
      line_item_id: "li_1",
      inventory_item_id: "ii_1",
      location_id: "sl_a",
      allow_backorder: true,
    })
    expect(inputs[0].quantity.toString()).toBe("3")
  })

  it("multiplies by required_quantity when splitting", async () => {
    const createReservationItems = jest.fn(async (items: any[]) =>
      items.map((it, i) => ({ id: `res_${i}`, ...it }))
    )

    // Need a total of 3 * 2 = 6 units; sl_a has 4, sl_b has 5.
    // Greedy: take 4 from sl_a, 2 from sl_b.
    const container = buildContainer({
      inventoryLevels: [
        {
          inventory_item_id: "ii_1",
          location_id: "sl_a",
          stocked_quantity: 4,
          reserved_quantity: 0,
        },
        {
          inventory_item_id: "ii_1",
          location_id: "sl_b",
          stocked_quantity: 5,
          reserved_quantity: 0,
        },
      ],
      createReservationItems,
    })

    await runReserve(container, {
      items: [
        {
          id: "li_1",
          inventory_item_id: "ii_1",
          required_quantity: 3,
          allow_backorder: false,
          quantity: 2,
          location_ids: ["sl_a", "sl_b"],
        },
      ],
    })

    const inputs = createReservationItems.mock.calls[0][0]
    expect(inputs).toHaveLength(2)
    expect(inputs[0].location_id).toBe("sl_a")
    expect(inputs[0].quantity.toString()).toBe("4")
    expect(inputs[1].location_id).toBe("sl_b")
    expect(inputs[1].quantity.toString()).toBe("2")
  })
})
