import type {
  BigNumberInput,
  IInventoryService,
  InventoryTypes,
} from "@medusajs/framework/types"
import {
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
  MathBN,
  Modules,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

type UpdateReservationItemInput = {
  id: string
  quantity: BigNumberInput
  location_id: string
}

type AdjustInventoryItemInput = {
  inventory_item_id: string
  location_id: string
  adjustment: BigNumberInput
}

type AdjustFulfillmentInventoryStepCompensationInput = {
  dataBeforeUpdate: InventoryTypes.ReservationItemDTO[]
  selects: string[]
  relations: string[]
  toDelete: string[]
  revertAdjustment: AdjustInventoryItemInput[]
  lockingKeys: string[]
}

/**
 * The details to adjust inventory when creating a fulfillment.
 */
export type AdjustFulfillmentInventoryStepInput = {
  /**
   * Reservation items to update with remaining quantity.
   */
  toUpdate: UpdateReservationItemInput[]
  /**
   * Reservation item IDs to delete.
   */
  toDelete: string[]
  /**
   * Inventory level adjustments to apply.
   */
  inventoryAdjustment: AdjustInventoryItemInput[]
}

export const adjustFulfillmentInventoryStepId =
  "adjust-fulfillment-inventory-step"
/**
 * This step atomically updates/deletes reservations and adjusts inventory
 * levels for a fulfillment.
 *
 * @example
 * const data = adjustFulfillmentInventoryStep({
 *   toUpdate: [
 *     {
 *       id: "res_123",
 *       quantity: 1,
 *       location_id: "sloc_123",
 *     },
 *   ],
 *   toDelete: ["res_456"],
 *   inventoryAdjustment: [
 *     {
 *       inventory_item_id: "iitem_123",
 *       location_id: "sloc_123",
 *       adjustment: -1,
 *     },
 *   ],
 * })
 */
export const adjustFulfillmentInventoryStep = createStep(
  adjustFulfillmentInventoryStepId,
  async (input: AdjustFulfillmentInventoryStepInput, { container }) => {
    const inventoryService = container.resolve<IInventoryService>(Modules.INVENTORY)
    const locking = container.resolve(Modules.LOCKING)

    const toUpdate = input.toUpdate ?? []
    const toDelete = Array.from(new Set(input.toDelete ?? []))
    const inventoryAdjustment = input.inventoryAdjustment ?? []

    const reservationIds = Array.from(
      new Set([...toUpdate.map((reservation) => reservation.id), ...toDelete])
    )

    const reservations = reservationIds.length
      ? await inventoryService.listReservationItems(
          {
            id: reservationIds,
          },
          {
            select: ["inventory_item_id"],
          }
        )
      : []

    const lockingKeys = Array.from(
      new Set([
        ...inventoryAdjustment.map((item) => item.inventory_item_id),
        ...reservations.map((reservation) => reservation.inventory_item_id),
      ])
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(toUpdate)

    const run = async (): Promise<AdjustFulfillmentInventoryStepCompensationInput> => {
      const dataBeforeUpdate = toUpdate.length
        ? await inventoryService.listReservationItems(
            {
              id: toUpdate.map((item) => item.id),
            },
            { relations, select: selects }
          )
        : []

      let updatedReservations = false
      let deletedReservations = false
      const adjustedInventoryLevels: AdjustInventoryItemInput[] = []

      try {
        if (toUpdate.length) {
          await inventoryService.updateReservationItems(toUpdate)
          updatedReservations = true
        }

        if (toDelete.length) {
          await inventoryService.softDeleteReservationItems(toDelete)
          deletedReservations = true
        }

        if (inventoryAdjustment.length) {
          for (const item of inventoryAdjustment) {
            await inventoryService.adjustInventory(
              item.inventory_item_id,
              item.location_id,
              item.adjustment
            )
            adjustedInventoryLevels.push(item)
          }
        }
      } catch (e) {
        // Roll back completed mutations before propagating the error,
        // since a throw here prevents StepResponse from being returned
        // and the workflow compensation would have no data to work with.
        if (adjustedInventoryLevels.length) {
          await inventoryService.adjustInventory(
            adjustedInventoryLevels
              .slice()
              .reverse()
              .map((item) => ({
                inventoryItemId: item.inventory_item_id,
                locationId: item.location_id,
                adjustment: MathBN.mult(item.adjustment, -1),
              }))
          )
        }

        if (deletedReservations) {
          await inventoryService.restoreReservationItems(toDelete)
        }

        if (updatedReservations && dataBeforeUpdate.length) {
          await inventoryService.updateReservationItems(
            dataBeforeUpdate.map((data) =>
              convertItemResponseToUpdateRequest(data, selects, relations)
            )
          )
        }

        throw e
      }

      return {
        dataBeforeUpdate,
        selects,
        relations,
        toDelete,
        revertAdjustment: inventoryAdjustment.map((item) => ({
          ...item,
          adjustment: MathBN.mult(item.adjustment, -1),
        })),
        lockingKeys,
      }
    }

    const compensationData = lockingKeys.length
      ? await locking.execute(lockingKeys, run)
      : await run()

    return new StepResponse(void 0, compensationData)
  },
  async (
    revertInput: AdjustFulfillmentInventoryStepCompensationInput | undefined,
    { container }
  ) => {
    if (!revertInput) {
      return
    }

    const inventoryService = container.resolve<IInventoryService>(Modules.INVENTORY)
    const locking = container.resolve(Modules.LOCKING)

    const run = async () => {
      if (revertInput.revertAdjustment.length) {
        await inventoryService.adjustInventory(
          revertInput.revertAdjustment.map((item) => ({
            inventoryItemId: item.inventory_item_id,
            locationId: item.location_id,
            adjustment: item.adjustment,
          }))
        )
      }

      if (revertInput.toDelete.length) {
        await inventoryService.restoreReservationItems(revertInput.toDelete)
      }

      if (revertInput.dataBeforeUpdate.length) {
        await inventoryService.updateReservationItems(
          revertInput.dataBeforeUpdate.map((data) =>
            convertItemResponseToUpdateRequest(
              data,
              revertInput.selects,
              revertInput.relations
            )
          )
        )
      }
    }

    if (revertInput.lockingKeys.length) {
      await locking.execute(revertInput.lockingKeys, run)
      return
    }

    await run()
  }
)
