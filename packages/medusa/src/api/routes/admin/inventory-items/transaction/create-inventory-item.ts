import { IInventoryService, InventoryItemDTO } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { EntityManager } from "typeorm"
import { ulid } from "ulid"
import { ProductVariant } from "../../../../../models"
import {
  ProductVariantInventoryService,
  ProductVariantService,
} from "../../../../../services"
import {
  DistributedTransaction,
  TransactionHandlerType,
  TransactionOrchestrator,
  TransactionPayload,
  TransactionState,
  TransactionStepsDefinition,
} from "../../../../../utils/transaction"

enum actions {
  createInventoryItem = "createInventoryItem",
  attachInventoryItem = "attachInventoryItem",
}

const flow: TransactionStepsDefinition = {
  next: {
    action: actions.createInventoryItem,
    saveResponse: true,
    next: {
      action: actions.attachInventoryItem,
      noCompensation: true,
    },
  },
}

const createInventoryItemStrategy = new TransactionOrchestrator(
  "create-inventory-item",
  flow
)

type InjectedDependencies = {
  manager: EntityManager
  productVariantService: ProductVariantService
  productVariantInventoryService: ProductVariantInventoryService
  inventoryService: IInventoryService
}

type CreateInventoryItemInput = {
  sku?: string
  hs_code?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  origin_country?: string
  mid_code?: string
  material?: string
  metadata?: Record<string, unknown>
}

export const createInventoryItemTransaction = async (
  dependencies: InjectedDependencies,
  variantId: string,
  input: CreateInventoryItemInput
): Promise<DistributedTransaction> => {
  const {
    manager,
    productVariantService,
    inventoryService,
    productVariantInventoryService,
  } = dependencies

  const productVariantInventoryServiceTx =
    productVariantInventoryService.withTransaction(manager)

  const productVariantServiceTx = productVariantService.withTransaction(manager)

  const variant = await productVariantServiceTx.retrieve(variantId)

  async function createInventoryItem(input: CreateInventoryItemInput) {
    return await inventoryService!.createInventoryItem({
      sku: variant.sku,
      origin_country: variant.origin_country,
      hs_code: variant.hs_code,
      mid_code: variant.mid_code,
      material: variant.material,
      weight: variant.weight,
      length: variant.length,
      height: variant.height,
      width: variant.width,
    })
  }

  async function removeInventoryItem(inventoryItem: InventoryItemDTO) {
    if (inventoryItem) {
      await inventoryService!.deleteInventoryItem(inventoryItem.id)
    }
  }

  async function attachInventoryItem(
    variant: ProductVariant,
    inventoryItem: InventoryItemDTO
  ) {
    if (!variant.manage_inventory) {
      return
    }

    await productVariantInventoryServiceTx.attachInventoryItem(
      variant.id,
      inventoryItem.id
    )
  }

  async function transactionHandler(
    actionId: string,
    type: TransactionHandlerType,
    payload: TransactionPayload
  ) {
    const command = {
      [actions.createInventoryItem]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateInventoryItemInput
        ) => {
          return await createInventoryItem(data)
        },
        [TransactionHandlerType.COMPENSATE]: async (
          data: CreateInventoryItemInput,
          { invoke }
        ) => {
          await removeInventoryItem(invoke[actions.createInventoryItem])
        },
      },
      [actions.attachInventoryItem]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateInventoryItemInput,
          { invoke }
        ) => {
          const { [actions.createInventoryItem]: inventoryItem } = invoke

          return await attachInventoryItem(variant, inventoryItem)
        },
      },
    }
    return command[actionId][type](payload.data, payload.context)
  }

  const transaction = await createInventoryItemStrategy.beginTransaction(
    ulid(),
    transactionHandler,
    input
  )
  await createInventoryItemStrategy.resume(transaction)

  if (transaction.getState() !== TransactionState.DONE) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      transaction
        .getErrors()
        .map((err) => err.error?.message)
        .join("\n")
    )
  }

  return transaction
}

export const revertVariantTransaction = async (
  transaction: DistributedTransaction
) => {
  await createInventoryItemStrategy.cancelTransaction(transaction)
}
