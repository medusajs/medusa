import {
  DistributedTransaction,
  TransactionHandlerType,
  TransactionOrchestrator,
  TransactionPayload,
  TransactionState,
  TransactionStepsDefinition,
} from "../../../../../utils/transaction"
import { ulid } from "ulid"
import { EntityManager } from "typeorm"
import { IInventoryService } from "../../../../../interfaces"
import {
  ProductVariantInventoryService,
  ProductVariantService,
} from "../../../../../services"
import { CreateProductVariantInput } from "../../../../../types/product-variant"
import { InventoryItemDTO } from "../../../../../types/inventory"
import { ProductVariant } from "../../../../../models"
import { MedusaError } from "medusa-core-utils"

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

  const inventoryServiceTx = inventoryService?.withTransaction(manager)

  const productVariantInventoryServiceTx =
    productVariantInventoryService.withTransaction(manager)

  const productVariantServiceTx = productVariantService.withTransaction(manager)

  async function createVariant() {
    const variant = await productVariantServiceTx.create(productId, input)

    return { variant }
  }

  async function removeVariant(variant: ProductVariant) {
    if (variant) {
      await productVariantServiceTx.delete(variant.id)
    }
  }

  async function createInventoryItem(variant) {
    if (!input.manage_inventory) {
      return
    }

    const inventoryItem = await inventoryServiceTx!.createInventoryItem({
      sku: input.sku,
      origin_country: input.origin_country,
      hs_code: input.hs_code,
      mid_code: input.mid_code,
      material: input.material,
      weight: input.weight,
      length: input.length,
      height: input.height,
      width: input.width,
    })

    return { inventoryItem }
  }

  async function removeInventoryItem(inventoryItem: InventoryItemDTO) {
    if (inventoryItem) {
      await inventoryServiceTx!.deleteInventoryItem(inventoryItem.id)
    }
  }

  async function attachInventoryItem(variant, inventoryItem) {
    if (!input.manage_inventory) {
      return
    }

    await productVariantInventoryServiceTx.attachInventoryItem(
      variant.id,
      inventoryItem.id,
      input.inventory_quantity
    )
  }

  async function transactionHandler(
    actionId: string,
    type: TransactionHandlerType,
    payload: TransactionPayload
  ) {
    const command = {
      [actions.createVariant]: {
        [TransactionHandlerType.INVOKE]: async () => {
          return await createVariant()
        },
        [TransactionHandlerType.COMPENSATE]: async (data, { invoke }) => {
          await removeVariant(invoke[actions.createVariant])
        },
      },
      [actions.createInventoryItem]: {
        [TransactionHandlerType.INVOKE]: async (data, { invoke }) => {
          const { [actions.createVariant]: variant } = invoke

          return await createInventoryItem(variant)
        },
        [TransactionHandlerType.COMPENSATE]: async (data, { invoke }) => {
          await removeInventoryItem(invoke[actions.createInventoryItem])
        },
      },
      [actions.attachInventoryItem]: {
        [TransactionHandlerType.INVOKE]: async (data, { invoke }) => {
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
