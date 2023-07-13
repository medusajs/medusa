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
import { PricingService, ProductService } from "../../../services"
import {
  defaultAdminProductFields,
  defaultAdminProductRelations,
} from "../../../api"

export enum CreateProductsWorkflowActions {
  prepare = "prepare",
  createProducts = "createProducts",
  attachToSalesChannel = "attachToSalesChannel",
  attachShippingProfile = "attachShippingProfile",
  createPrices = "createPrices",
  createInventoryItems = "createInventoryItems",
  attachInventoryItems = "attachInventoryItems",
  result = "result",
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: CreateProductsWorkflowActions.prepare,
    saveResponse: true,
    noCompensation: true,
    next: {
      action: CreateProductsWorkflowActions.createProducts,
      saveResponse: true,
      next: [
        {
          action: CreateProductsWorkflowActions.attachShippingProfile,
        },
        {
          action: CreateProductsWorkflowActions.attachToSalesChannel,
        },
        {
          action: CreateProductsWorkflowActions.createPrices,
          saveResponse: true,
          next: {
            action: CreateProductsWorkflowActions.createInventoryItems,
            saveResponse: true,
            next: {
              action: CreateProductsWorkflowActions.attachInventoryItems,
              noCompensation: true,
              next: {
                action: CreateProductsWorkflowActions.result,
                noCompensation: true,
                saveResponse: true,
              },
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
}

type CreateProductsWorkflowInputData = (ProductTypes.CreateProductDTO & {
  sales_channels?: { id: string }[]
})[]

type CreateProductsStepResponse = {
  products: ProductTypes.ProductDTO[]
  productsHandleShippingProfileMap: Map<string, string>
  productsHandleSalesChannelsMap: Map<string, string[]>
}

const shouldSkipInventoryStep = (
  container: MedusaContainer,
  stepName: string
) => {
  const inventoryService = container.resolve(
    "inventoryService"
  ) as IInventoryService
  if (!inventoryService) {
    const logger = container.resolve("logger")
    logger.warn(
      `Inventory service not found. You should install the @medusajs/inventory package to use inventory. The '${stepName}' will be skipped.`
    )
    return true
  }

  return false
}

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
      [CreateProductsWorkflowActions.prepare]: {
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
      [CreateProductsWorkflowActions.createProducts]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductsData,
          { invoke }
        ): Promise<ProductTypes.ProductDTO[]> => {
          const preparedData = invoke[
            CreateProductsWorkflowActions.prepare
          ] as CreateProductPreparedData

          return await createProducts({
            container,
            data,
          })
        },
        [TransactionHandlerType.COMPENSATE]: async (
          data: any[],
          { invoke }
        ) => {
          const createdProductsRes = invoke[
            CreateProductsWorkflowActions.createProducts
          ] as CreateProductsStepResponse

          return await removeProducts({
            container,
            data: createdProductsRes.products,
          })
        },
      },
      [CreateProductsWorkflowActions.attachShippingProfile]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          const products = invoke[
            CreateProductsWorkflowActions.createProducts
          ] as ProductTypes.ProductDTO[]
          const { productsHandleShippingProfileMap } = invoke[
            CreateProductsWorkflowActions.prepare
          ] as CreateProductPreparedData

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
            CreateProductsWorkflowActions.createProducts
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
      [CreateProductsWorkflowActions.createPrices]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          const { productsHandleSalesChannelsMap } = invoke[
            CreateProductsWorkflowActions.createProducts
          ] as CreateProductsStepResponse
        },
      },
      [CreateProductsWorkflowActions.attachToSalesChannel]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          const { productsHandleSalesChannelsMap } = invoke[
            CreateProductsWorkflowActions.createProducts
          ] as CreateProductsStepResponse
        },
      },
      [CreateProductsWorkflowActions.createInventoryItems]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          const shouldSkipStep_ = shouldSkipInventoryStep(
            container,
            CreateProductsWorkflowActions.createInventoryItems
          )
          if (shouldSkipStep_) {
            return
          }

          const { [CreateProductsWorkflowActions.createProducts]: products } =
            invoke

          return await createInventoryItems({
            container,
            manager,
            data: products,
          })
        },
        [TransactionHandlerType.COMPENSATE]: async (_, { invoke }) => {
          const shouldSkipStep_ = shouldSkipInventoryStep(
            container,
            CreateProductsWorkflowActions.createInventoryItems
          )
          if (shouldSkipStep_) {
            return
          }

          const variantInventoryItemsData =
            invoke[CreateProductsWorkflowActions.createInventoryItems]
          await removeInventoryItems({
            container,
            manager,
            data: variantInventoryItemsData,
          })
        },
      },
      [CreateProductsWorkflowActions.attachInventoryItems]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          const shouldSkipStep_ = shouldSkipInventoryStep(
            container,
            CreateProductsWorkflowActions.attachInventoryItems
          )
          if (shouldSkipStep_) {
            return
          }

          const {
            [CreateProductsWorkflowActions.createInventoryItems]:
              inventoryItemsResult,
          } = invoke

          return await attachInventoryItems({
            container,
            manager,
            data: inventoryItemsResult,
          })
        },
      },
      [CreateProductsWorkflowActions.result]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductVariantInput[],
          { invoke }
        ) => {
          const { [CreateProductsWorkflowActions.createProducts]: products } =
            invoke

          const productService = container.resolve(
            "productService"
          ) as ProductService
          const pricingService = container.resolve(
            "pricingService"
          ) as PricingService

          const rawProduct = await productService
            .withTransaction(manager)
            .retrieve(products[0].id, {
              select: defaultAdminProductFields,
              relations: defaultAdminProductRelations,
            })

          const [product] = await pricingService
            .withTransaction(manager)
            .setProductPrices([rawProduct])

          return product
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

export const revertCreateProductsTransaction = async (
  transaction: DistributedTransaction
) => {
  await createProductOrchestrator.cancelTransaction(transaction)
}

export const getResult = (transaction: DistributedTransaction): any => {
  if (transaction.hasFinished()) {
    return transaction.getContext()
  }
}
