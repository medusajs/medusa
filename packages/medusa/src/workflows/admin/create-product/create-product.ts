import { EntityManager } from "typeorm"
import {
  IInventoryService,
  MedusaContainer,
  ProductTypes,
} from "@medusajs/types"
import { ulid } from "ulid"
import { MedusaError } from "@medusajs/utils"
import {
  DistributedTransaction,
  TransactionHandlerType,
  TransactionOrchestrator,
  TransactionPayload,
  TransactionState,
  TransactionStepsDefinition,
} from "../../../utils/transaction"
import { CreateProductVariantInput } from "../../../types/product-variant"
import {
  attachInventoryItems,
  createInventoryItems,
  createProducts,
  removeInventoryItems,
  removeProducts,
} from "../../functions"

enum Actions {
  createProduct = "createProduct",
  createPrices = "createPrices",
  attachToSalesChannel = "attachToSalesChannel",
  createInventoryItems = "createInventoryItems",
  attachInventoryItems = "attachInventoryItems",
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: Actions.createProduct,
    saveResponse: true,
    next: {
      action: Actions.attachToSalesChannel,
      saveResponse: true,
      next: {
        action: Actions.createPrices,
        saveResponse: true,
        next: {
          action: Actions.createInventoryItems,
          saveResponse: true,
          next: {
            action: Actions.attachInventoryItems,
            noCompensation: true,
          },
        },
      },
    },
  },
}

const createProductOrchestrator = new TransactionOrchestrator(
  "create-product",
  workflowSteps
)

type InjectedDependencies = {
  manager: EntityManager
  container: MedusaContainer
  inventoryService?: IInventoryService
}

export async function createProductWorkflow(
  dependencies: InjectedDependencies,
  productId: string,
  input: CreateProductVariantInput[]
): Promise<DistributedTransaction> {
  const { manager, container } = dependencies
  async function transactionHandler(
    actionId: string,
    type: TransactionHandlerType,
    payload: TransactionPayload
  ) {
    const command = {
      [Actions.createProduct]: {
        [TransactionHandlerType.INVOKE]: async (
          data: ProductTypes.CreateProductDTO[]
        ) => {
          return await createProducts({
            container,
            data,
          })
        },
        [TransactionHandlerType.COMPENSATE]: async (
          data: any[],
          { invoke }
        ) => {
          const createdProducts = invoke[Actions.createProduct]
          return await removeProducts({ container, data: createdProducts })
        },
      },
      [Actions.createInventoryItems]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          const { [Actions.createProduct]: products } = invoke

          return await createInventoryItems({
            container,
            manager,
            data: products,
          })
        },
        [TransactionHandlerType.COMPENSATE]: async (_, { invoke }) => {
          const variantInventoryItemsData = invoke[Actions.createInventoryItems]
          await removeInventoryItems({
            container,
            manager,
            data: variantInventoryItemsData,
          })
        },
      },
      [Actions.attachInventoryItems]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          const { [Actions.createInventoryItems]: inventoryItemsResult } =
            invoke

          return await attachInventoryItems({
            container,
            manager,
            data: inventoryItemsResult,
          })
        },
      },
    }
    return command[actionId][type](payload.data, payload.context)
  }

  const orchestrator = createProductOrchestrator

  const transaction = await orchestrator.beginTransaction(
    ulid(),
    transactionHandler,
    input
  )

  await orchestrator.resume(transaction)

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
