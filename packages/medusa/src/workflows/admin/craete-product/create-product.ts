import { EntityManager } from "typeorm"
import { IInventoryService } from "@medusajs/types"
import { ulid } from "ulid"
import { MedusaError } from "@medusajs/utils"
import { AdminCreateProductHandlers } from "./utils/step-handlers"
import {
  DistributedTransaction,
  TransactionHandlerType,
  TransactionOrchestrator,
  TransactionPayload,
  TransactionState,
  TransactionStepsDefinition,
} from "../../../utils/transaction"
import { ProductVariantInventoryService } from "../../../services"
import { CreateProductVariantInput } from "../../../types/product-variant"

enum Actions {
  createProduct = "createProduct",
  createInventoryItems = "createInventoryItems",
  attachInventoryItems = "attachInventoryItems",
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: Actions.createProduct,
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
}

const createProductOrchestrator = new TransactionOrchestrator(
  "create-product",
  workflowSteps
)

type InjectedDependencies = {
  manager: EntityManager
  productVariantInventoryService: ProductVariantInventoryService
  inventoryService?: IInventoryService
}

export async function createProductWorkflow(
  dependencies: InjectedDependencies,
  productId: string,
  input: CreateProductVariantInput[]
): Promise<DistributedTransaction> {
  const { manager, inventoryService, productVariantInventoryService } =
    dependencies

  const productVariantInventoryServiceTx =
    productVariantInventoryService.withTransaction(manager)

  const stepDependencies = {
    manager,
    inventoryService,
    productVariantInventoryService: productVariantInventoryServiceTx,
  }

  const stepHandlers = new AdminCreateProductHandlers(stepDependencies)

  async function transactionHandler(
    actionId: string,
    type: TransactionHandlerType,
    payload: TransactionPayload
  ) {
    const command = {
      [Actions.createProduct]: {
        [TransactionHandlerType.INVOKE]: async (data: any[]) => {
          return await stepHandlers.createProduct(data)
        },
        [TransactionHandlerType.COMPENSATE]: async (
          data: any[],
          { invoke }
        ) => {
          const createdProducts = invoke[Actions.createProduct]
          await stepHandlers.removeProduct(createdProducts)
        },
      },
      [Actions.createInventoryItems]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          const { [Actions.createProduct]: products } = invoke

          return await stepHandlers.createInventoryItems(products)
        },
        [TransactionHandlerType.COMPENSATE]: async (_, { invoke }) => {
          const variantInventoryItemsData = invoke[Actions.createInventoryItems]
          await stepHandlers.removeInventoryItems(variantInventoryItemsData)
        },
      },
      [Actions.attachInventoryItems]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          const { [Actions.createInventoryItems]: inventoryItemsResult } =
            invoke

          return await stepHandlers.attachInventoryItems(inventoryItemsResult)
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
