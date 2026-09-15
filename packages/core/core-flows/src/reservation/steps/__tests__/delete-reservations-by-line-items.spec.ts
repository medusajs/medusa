import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { Modules } from "@medusajs/framework/utils"
import { createStep, createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk"
import { deleteReservationsByLineItemsStep } from "../delete-reservations-by-line-items"

const failStep = createStep("failStep", async () => {
  throw new Error("Step failed intentionally")
})

const buildContainer = (
  inventoryOverrides: Record<string, any> = {}
): { container: MedusaContainer; calls: Record<string, any[]> } => {
  const calls: Record<string, any[]> = {
    listReservationItems: [],
    deleteReservationItemsByLineItem: [],
    restoreReservationItems: [],
    restoreReservationItemsByLineItem: [],
    lockingExecute: [],
  }

  const container = createContainer() as unknown as MedusaContainer

  container.register(
    Modules.INVENTORY,
    asFunction(() => ({
      listReservationItems: async (filters: any, config?: any) => {
        calls.listReservationItems.push({ filters, config })
        if (filters.line_item_id?.includes("item_1")) {
          return [
            { id: "res_1", inventory_item_id: "inv_1", line_item_id: "item_1" },
            { id: "res_2", inventory_item_id: "inv_2", line_item_id: "item_1" },
          ]
        }
        return []
      },
      deleteReservationItemsByLineItem: async (ids: string[]) => {
        calls.deleteReservationItemsByLineItem.push(ids)
      },
      restoreReservationItems: async (ids: string[]) => {
        calls.restoreReservationItems.push(ids)
      },
      restoreReservationItemsByLineItem: async (ids: string[]) => {
        calls.restoreReservationItemsByLineItem.push(ids)
      },
      ...inventoryOverrides,
    }))
  )

  container.register(
    Modules.LOCKING,
    asFunction(() => ({
      execute: async (keys: string[], fn: () => Promise<any>) => {
        calls.lockingExecute.push(keys)
        return await fn()
      },
    }))
  )

  return { container, calls }
}

describe("deleteReservationsByLineItemsStep", () => {
  it("should delete reservations by line items and return reservation ids", async () => {
    const { container, calls } = buildContainer()

    const workflow = createWorkflow("test-delete-reservations-success", () => {
      const deletedIds = deleteReservationsByLineItemsStep(["item_1"])
      return new WorkflowResponse(deletedIds)
    })

    const { result } = await workflow(container).run()

    expect(result).toEqual(["res_1", "res_2"])
    expect(calls.deleteReservationItemsByLineItem).toEqual([["item_1"]])
    expect(calls.lockingExecute).toEqual([["inv_1", "inv_2"]])
  })

  it("should handle empty line item ids without querying or locking", async () => {
    const { container, calls } = buildContainer()

    const workflow = createWorkflow("test-delete-reservations-empty", () => {
      const deletedIds = deleteReservationsByLineItemsStep([])
      return new WorkflowResponse(deletedIds)
    })

    const { result } = await workflow(container).run()

    expect(result).toEqual([])
    expect(calls.listReservationItems).toHaveLength(0)
    expect(calls.deleteReservationItemsByLineItem).toHaveLength(0)
    expect(calls.lockingExecute).toHaveLength(0)
  })

  it("should compensate by restoring only deleted reservation ids and not all by line_item_id", async () => {
    const { container, calls } = buildContainer()

    const workflow = createWorkflow("test-delete-reservations-compensation", () => {
      deleteReservationsByLineItemsStep(["item_1"])
      failStep()
    })

    const { errors } = await workflow(container).run({
      throwOnError: false,
    })

    expect(errors).toHaveLength(1)
    expect(errors[0].error.message).toBe("Step failed intentionally")

    expect(calls.deleteReservationItemsByLineItem).toEqual([["item_1"]])
    expect(calls.restoreReservationItems).toEqual([["res_1", "res_2"]])
    expect(calls.restoreReservationItemsByLineItem).toHaveLength(0)
  })
})
