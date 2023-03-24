import { IInventoryService, InventoryItemDTO } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { EntityManager } from "typeorm"
import { ulid } from "ulid"
import { ProductVariant } from "../../../../../models"
import {
  ProductVariantInventoryService,
  ProductVariantService,
} from "../../../../../services"
import { CreateProductVariantInput } from "../../../../../types/product-variant"
import {
  DistributedTransaction,
  TransactionHandlerType,
  TransactionOrchestrator,
  TransactionPayload,
  TransactionState,
  TransactionStepsDefinition,
} from "../../../../../utils/transaction"

enum actions {
  createVariant = "createVariant",
  createInventoryItem = "createInventoryItem",
  attachInventoryItem = "attachInventoryItem",
}

const simpleFlow: TransactionStepsDefinition = {
  next: {
    action: actions.createVariant,
  },
}

const flowWithInventory: TransactionStepsDefinition = {
  next: {
    action: actions.createVariant,
    saveResponse: true,
    next: {
      action: actions.createInventoryItem,
      saveResponse: true,
      next: {
        action: actions.attachInventoryItem,
        noCompensation: true,
      },
    },
  },
}

const createSimpleVariantStrategy = new TransactionOrchestrator(
  "create-variant",
  simpleFlow
)

const createVariantStrategyWithInventory = new TransactionOrchestrator(
  "create-variant-with-inventory",
  flowWithInventory
)

type InjectedDependencies = {
  manager: EntityManager
  productVariantService: ProductVariantService
  productVariantInventoryService: ProductVariantInventoryService
  inventoryService?: IInventoryService
}

export const createVariantTransaction = async (
  dependencies: InjectedDependencies,
  productId: string,
  input: CreateProductVariantInput
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

  async function createVariant(variantInput: CreateProductVariantInput) {
    return await productVariantServiceTx.create(productId, variantInput)
  }

  async function removeVariant(variant: ProductVariant) {
    if (variant) {
      await productVariantServiceTx.delete(variant.id)
    }
  }

  async function createInventoryItem(variant: ProductVariant) {
    if (!variant.manage_inventory) {
      return
    }

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
      [actions.createVariant]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput
        ) => {
          return await createVariant(data)
        },
        [TransactionHandlerType.COMPENSATE]: async (
          data: CreateProductVariantInput,
          { invoke }
        ) => {
          await removeVariant(invoke[actions.createVariant])
        },
      },
      [actions.createInventoryItem]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput,
          { invoke }
        ) => {
          const { [actions.createVariant]: variant } = invoke

          return await createInventoryItem(variant)
        },
        [TransactionHandlerType.COMPENSATE]: async (
          data: CreateProductVariantInput,
          { invoke }
        ) => {
          await removeInventoryItem(invoke[actions.createInventoryItem])
        },
      },
      [actions.attachInventoryItem]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput,
          { invoke }
        ) => {
          const {
            [actions.createVariant]: variant,
            [actions.createInventoryItem]: inventoryItem,
          } = invoke

          return await attachInventoryItem(variant, inventoryItem)
        },
      },
    }
    return command[actionId][type](payload.data, payload.context)
  }

  const strategy = inventoryService
    ? createVariantStrategyWithInventory
    : createSimpleVariantStrategy

  const transaction = await strategy.beginTransaction(
    ulid(),
    transactionHandler,
    input
  )
  await strategy.resume(transaction)

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
  dependencies: InjectedDependencies,
  transaction: DistributedTransaction
) => {
  const { inventoryService } = dependencies
  const strategy = inventoryService
    ? createVariantStrategyWithInventory
    : createSimpleVariantStrategy

  await strategy.cancelTransaction(transaction)
}
