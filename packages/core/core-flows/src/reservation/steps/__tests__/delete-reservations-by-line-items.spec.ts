import { MedusaContainer } from "@medusajs/framework"
import { asValue, createContainer } from "@medusajs/framework/awilix"
import { Modules } from "@medusajs/framework/utils"
import { createStep, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteReservationsByLineItemsStep } from "../delete-reservations-by-line-items"

describe("deleteReservationsByLineItemsStep compensation", () => {
  it("restores only the reservations deleted by this step", async () => {
    const service = {
      listReservationItems: jest
        .fn()
        .mockResolvedValue([
          { id: "res_active", inventory_item_id: "iitem_1" },
        ]),
      deleteReservationItemsByLineItem: jest.fn(),
      restoreReservationItems: jest.fn(),
      restoreReservationItemsByLineItem: jest.fn(),
    }
    const locking = {
      execute: jest.fn(async (_keys: string[], task: () => Promise<void>) =>
        task()
      ),
    }
    const container = createContainer() as unknown as MedusaContainer
    container.register(Modules.INVENTORY, asValue(service))
    container.register(Modules.LOCKING, asValue(locking))

    const failStep = createStep(
      "force-reservation-compensation-failure",
      async () => {
        throw new Error("force compensation")
      }
    )
    const workflow = createWorkflow("restore-only-deleted-reservations", () => {
      deleteReservationsByLineItemsStep(["line_1"])
      failStep()
    })

    const result = await workflow(container).run({
      input: {},
      throwOnError: false,
    })

    expect(result.errors).toHaveLength(1)
    expect(service.deleteReservationItemsByLineItem).toHaveBeenCalledWith([
      "line_1",
    ])
    expect(service.restoreReservationItems).toHaveBeenCalledWith(["res_active"])
    expect(service.restoreReservationItemsByLineItem).not.toHaveBeenCalled()
  })
})
