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
  attachShippingProfileToProduct,
  createInventoryItems,
  CreateProductPreparedData,
  createProducts,
  CreateProductsData,
  CreateProductsInputData,
  prepareCreateProductData,
  removeInventoryItems,
  removeProducts,
} from "../../functions"
import { detachShippingProfileFromProduct } from "../../functions/detach-shipping-profile-from-product"

enum Actions {
  prepare = "prepare",
  createProducts = "createProducts",
  attachToSalesChannel = "attachToSalesChannel",
  attachShippingProfile = "attachShippingProfile",
  createPrices = "createPrices",
  createInventoryItems = "createInventoryItems",
  attachInventoryItems = "attachInventoryItems",
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: Actions.prepare,
    saveResponse: true,
    noCompensation: true,
    next: {
      action: Actions.createProducts,
      saveResponse: true,
      next: [
        {
          action: Actions.attachShippingProfile,
        },
        {
          action: Actions.attachToSalesChannel,
        },
        {
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
      ],
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

type CreateProductsWorkflowInputData = {
  shippingProfileId?: string
  salesChannelIds?: string[]
  product: ProductTypes.CreateProductDTO
}[]

type CreateProductsStepResponse = {
  products: ProductTypes.ProductDTO[]
} & CreateProductPreparedData

export async function createProductsWorkflow(
  dependencies: InjectedDependencies,
  input: CreateProductsInputData
): Promise<DistributedTransaction> {
  const { manager, container } = dependencies

  async function transactionHandler(
    actionId: string,
    type: TransactionHandlerType,
    payload: TransactionPayload
  ) {
    const command = {
      [Actions.prepare]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductsWorkflowInputData
        ) => {
          return await prepareCreateProductData({
            container,
            manager,
            data,
          })
        },
      },
      [Actions.createProducts]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductsData,
          { invoke }
        ): Promise<CreateProductsStepResponse> => {
          const preparedData = invoke[
            Actions.prepare
          ] as CreateProductPreparedData

          const products = await createProducts({
            container,
            data,
          })

          return {
            products,
            ...preparedData,
          }
        },
        [TransactionHandlerType.COMPENSATE]: async (
          data: any[],
          { invoke }
        ) => {
          const createdProductsRes = invoke[
            Actions.createProducts
          ] as CreateProductsStepResponse

          return await removeProducts({
            container,
            data: createdProductsRes.products,
          })
        },
      },
      [Actions.attachShippingProfile]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          const { productsHandleShippingProfileMap, products } = invoke[
            Actions.createProducts
          ] as CreateProductsStepResponse

          return await attachShippingProfileToProduct({
            container,
            manager,
            data: {
              productsHandleShippingProfileMap,
              products,
            },
          })
        },
        [TransactionHandlerType.COMPENSATE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          const { productsHandleShippingProfileMap, products } = invoke[
            Actions.createProducts
          ] as CreateProductsStepResponse

          return await detachShippingProfileFromProduct({
            container,
            manager,
            data: {
              productsHandleShippingProfileMap,
              products,
            },
          })
        },
      },
      [Actions.attachToSalesChannel]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          const { productsHandleSalesChannelsMap } = invoke[
            Actions.createProducts
          ] as CreateProductsStepResponse
        },
      },
      [Actions.createInventoryItems]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          const { [Actions.createProducts]: products } = invoke

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
