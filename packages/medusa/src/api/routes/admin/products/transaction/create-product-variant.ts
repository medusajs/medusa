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
  createVariants = "createVariants",
  createInventoryItems = "createInventoryItems",
  attachInventoryItems = "attachInventoryItems",
}

const simpleFlow: TransactionStepsDefinition = {
  next: {
    action: actions.createVariants,
  },
}

const flowWithInventory: TransactionStepsDefinition = {
  next: {
    action: actions.createVariants,
    saveResponse: true,
    next: {
      action: actions.createInventoryItems,
      saveResponse: true,
      next: {
        action: actions.attachInventoryItems,
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

export const createVariantsTransaction = async (
  dependencies: InjectedDependencies,
  productId: string,
  input: CreateProductVariantInput[]
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

  async function createVariants(variantInput: CreateProductVariantInput[]) {
    return await productVariantServiceTx.create(productId, variantInput)
  }

  async function removeVariants(variants: ProductVariant[]) {
    if (variants.length) {
      await productVariantServiceTx.delete(variants.map((v) => v.id))
    }
  }

  async function createInventoryItems(variants: ProductVariant[] = []) {
    const context = { transactionManager: manager }

    return await Promise.all(
      variants.map(async (variant) => {
        if (!variant.manage_inventory) {
          return
        }

        const inventoryItem = await inventoryService!.createInventoryItem(
          {
            sku: variant.sku,
            origin_country: variant.origin_country,
            hs_code: variant.hs_code,
            mid_code: variant.mid_code,
            material: variant.material,
            weight: variant.weight,
            length: variant.length,
            height: variant.height,
            width: variant.width,
          },
          context
        )

        return { variant, inventoryItem }
      })
    )
  }

  async function removeInventoryItems(
    data: {
      variant: ProductVariant
      inventoryItem: InventoryItemDTO
    }[] = []
  ) {
    const context = { transactionManager: manager }

    return await Promise.all(
      data.map(async ({ inventoryItem }) => {
        return await inventoryService!.deleteInventoryItem(
          inventoryItem.id,
          context
        )
      })
    )
  }

  async function attachInventoryItems(
    data: {
      variant: ProductVariant
      inventoryItem: InventoryItemDTO
    }[]
  ) {
    return await Promise.all(
      data
        .filter((d) => d)
        .map(async ({ variant, inventoryItem }) => {
          return productVariantInventoryServiceTx.attachInventoryItem(
            variant.id,
            inventoryItem.id
          )
        })
    )
  }

  async function transactionHandler(
    actionId: string,
    type: TransactionHandlerType,
    payload: TransactionPayload
  ) {
    const command = {
      [actions.createVariants]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput[]
        ) => {
          return await createVariants(data)
        },
        [TransactionHandlerType.COMPENSATE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          await removeVariants(invoke[actions.createVariants])
        },
      },
      [actions.createInventoryItems]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          const { [actions.createVariants]: variants } = invoke

          return await createInventoryItems(variants)
        },
        [TransactionHandlerType.COMPENSATE]: async (
          data: {
            variant: ProductVariant
            inventoryItem: InventoryItemDTO
          }[],
          { invoke }
        ) => {
          await removeInventoryItems(invoke[actions.createInventoryItems])
        },
      },
      [actions.attachInventoryItems]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          const {
            [actions.createVariants]: variants,
            [actions.createInventoryItems]: inventoryItemsResult,
          } = invoke

          return await attachInventoryItems(inventoryItemsResult)
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
