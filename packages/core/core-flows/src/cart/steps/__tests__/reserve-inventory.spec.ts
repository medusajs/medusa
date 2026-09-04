import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { Modules } from "@medusajs/framework/utils"
import {
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import { reserveInventoryStep } from "../reserve-inventory"
import { reserveInventoryWorkflow } from "../../workflows/reserve-inventory"

const buildContainer = ({
  createReservationItems,
}: {
  createReservationItems: jest.Mock<any, any>
}) => {
  const container = createContainer() as unknown as MedusaContainer

  container.register(
    Modules.INVENTORY,
    asFunction(() => ({
      createReservationItems,
      deleteReservationItems: jest.fn(async () => {}),
    }))
  )

  container.register(
    Modules.LOCKING,
    asFunction(() => ({
      execute: jest.fn(async (_keys: string[], cb: () => Promise<any>) => cb()),
    }))
  )

  return container
}

const createReservationItemsMock = () =>
  jest.fn(async (items: any[]) =>
    items.map((item, i) => ({ id: `res_${i}`, ...item }))
  )

const runReserveStep = async (container: MedusaContainer, input: any) => {
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
  it("reserves the full quantity at the first location by default", async () => {
    const createReservationItems = createReservationItemsMock()
    const container = buildContainer({ createReservationItems })

    await runReserveStep(container, {
      items: [
        {
          id: "li_1",
          inventory_item_id: "ii_1",
          required_quantity: 2,
          allow_backorder: false,
          quantity: 3,
          location_ids: ["sl_a", "sl_b"],
        },
      ],
    })

    expect(createReservationItems).toHaveBeenCalledTimes(1)
    const inputs = createReservationItems.mock.calls[0][0]
    expect(inputs).toHaveLength(1)
    expect(inputs[0]).toMatchObject({
      line_item_id: "li_1",
      inventory_item_id: "ii_1",
      allow_backorder: false,
      location_id: "sl_a",
    })
    expect(inputs[0].quantity.toString()).toBe("6")
  })

  it("splits the reservation across locations when no single location covers the quantity (issue #14987)", async () => {
    const createReservationItems = createReservationItemsMock()
    const container = buildContainer({ createReservationItems })

    await runReserveStep(container, {
      items: [
        {
          id: "li_1",
          inventory_item_id: "ii_1",
          required_quantity: 1,
          allow_backorder: false,
          quantity: 2,
          location_ids: ["sl_a", "sl_b"],
          location_availability: [
            { location_id: "sl_a", available_quantity: 1 },
            { location_id: "sl_b", available_quantity: 1 },
          ],
        },
      ],
    })

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

  it("uses custom allocations for matching items", async () => {
    const createReservationItems = createReservationItemsMock()
    const container = buildContainer({ createReservationItems })

    await runReserveStep(container, {
      items: [
        {
          id: "li_1",
          inventory_item_id: "ii_1",
          required_quantity: 1,
          allow_backorder: false,
          quantity: 2,
          location_ids: ["sl_a", "sl_b"],
          location_availability: [
            { location_id: "sl_a", available_quantity: 5 },
            { location_id: "sl_b", available_quantity: 5 },
          ],
        },
        {
          id: "li_2",
          inventory_item_id: "ii_2",
          required_quantity: 1,
          allow_backorder: false,
          quantity: 1,
          location_ids: ["sl_a"],
        },
      ],
      allocations: [
        {
          line_item_id: "li_1",
          inventory_item_id: "ii_1",
          allocations: [{ location_id: "sl_b", quantity: 2 }],
        },
      ],
    })

    const inputs = createReservationItems.mock.calls[0][0]
    expect(inputs).toHaveLength(2)
    // li_1 uses the custom allocation instead of the default (sl_a)
    expect(inputs[0]).toMatchObject({
      line_item_id: "li_1",
      inventory_item_id: "ii_1",
      location_id: "sl_b",
    })
    expect(inputs[0].quantity.toString()).toBe("2")
    // li_2 has no matching allocation and keeps the default behavior
    expect(inputs[1]).toMatchObject({
      line_item_id: "li_2",
      inventory_item_id: "ii_2",
      location_id: "sl_a",
    })
  })

  it("throws when a custom allocation does not add up to the item's quantity", async () => {
    const createReservationItems = createReservationItemsMock()
    const container = buildContainer({ createReservationItems })

    let error: any
    try {
      const result = await runReserveStep(container, {
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
        allocations: [
          {
            line_item_id: "li_1",
            inventory_item_id: "ii_1",
            allocations: [{ location_id: "sl_b", quantity: 1 }],
          },
        ],
      })
      error = result.errors?.[0]?.error
    } catch (e) {
      error = e
    }

    expect(error?.message).toContain(
      "Reservation allocations for item li_1 (inventory item ii_1) must consist of positive quantities adding up to 2"
    )

    expect(createReservationItems).not.toHaveBeenCalled()
  })
})

describe("reserveInventoryWorkflow", () => {
  it("applies allocations returned by the setReservationAllocations hook", async () => {
    const createReservationItems = createReservationItemsMock()
    const container = buildContainer({ createReservationItems })

    reserveInventoryWorkflow.hooks.setReservationAllocations(
      ({ items, cart }: any) => {
        const pickupLocationId = cart?.metadata?.pickup_location_id

        return new StepResponse(
          items.map((item: any) => ({
            line_item_id: item.id,
            inventory_item_id: item.inventory_item_id,
            allocations: [
              {
                location_id: pickupLocationId,
                quantity: item.required_quantity * item.quantity,
              },
            ],
          }))
        )
      }
    )

    await reserveInventoryWorkflow(container).run({
      input: {
        items: [
          {
            id: "li_1",
            inventory_item_id: "ii_1",
            required_quantity: 1,
            allow_backorder: false,
            quantity: 2,
            location_ids: ["sl_a", "sl_b"],
            location_availability: [
              { location_id: "sl_a", available_quantity: 5 },
              { location_id: "sl_b", available_quantity: 5 },
            ],
          },
        ],
        cart: {
          id: "cart_1",
          metadata: { pickup_location_id: "sl_pickup" },
        } as any,
      },
    })

    const inputs = createReservationItems.mock.calls[0][0]
    expect(inputs).toHaveLength(1)
    expect(inputs[0]).toMatchObject({
      line_item_id: "li_1",
      inventory_item_id: "ii_1",
      location_id: "sl_pickup",
    })
    expect(inputs[0].quantity.toString()).toBe("2")
  })
})
