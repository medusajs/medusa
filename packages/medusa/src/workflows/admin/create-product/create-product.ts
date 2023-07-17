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
import {
  attachInventoryItems,
  attachSalesChannelToProducts,
  attachShippingProfileToProducts,
  createInventoryItems,
  createProducts,
  CreateProductsData,
  CreateProductsInputData,
  CreateProductsPreparedData,
  createProductsVariantsPrices,
  detachSalesChannelFromProducts,
  detachShippingProfileFromProducts,
  prepareCreateProductsData,
  removeInventoryItems,
  removeProducts,
} from "../../functions"
import { PricingService, ProductService } from "../../../services"
import {
  AdminPostProductsReq,
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
          next: {
            action: CreateProductsWorkflowActions.createInventoryItems,
            next: {
              action: CreateProductsWorkflowActions.attachInventoryItems,
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

type CreateProductsWorkflowInputData = AdminPostProductsReq[]

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
          return await prepareCreateProductsData({
            container,
            manager,
            data,
          })
        },
      },

      [CreateProductsWorkflowActions.createProducts]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductsData
        ): Promise<ProductTypes.ProductDTO[]> => {
          return await createProducts({
            container,
            data,
          })
        },
        [TransactionHandlerType.COMPENSATE]: async (
          data: CreateProductsWorkflowInputData,
          { invoke }
        ) => {
          const products = invoke[
            CreateProductsWorkflowActions.createProducts
          ] as ProductTypes.ProductDTO[]

          return await removeProducts({
            container,
            data: products,
          })
        },
      },

      [CreateProductsWorkflowActions.attachShippingProfile]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductsWorkflowInputData,
          { invoke }
        ) => {
          const products = invoke[
            CreateProductsWorkflowActions.createProducts
          ] as ProductTypes.ProductDTO[]
          const { productsHandleShippingProfileMap } = invoke[
            CreateProductsWorkflowActions.prepare
          ] as CreateProductsPreparedData

          return await attachShippingProfileToProducts({
            container,
            manager,
            data: {
              productsHandleShippingProfileMap,
              products,
            },
          })
        },
        [TransactionHandlerType.COMPENSATE]: async (
          data: CreateProductsWorkflowInputData,
          { invoke }
        ) => {
          const products = invoke[
            CreateProductsWorkflowActions.createProducts
          ] as ProductTypes.ProductDTO[]
          const { productsHandleShippingProfileMap } = invoke[
            CreateProductsWorkflowActions.prepare
          ] as CreateProductsPreparedData

          return await detachShippingProfileFromProducts({
            container,
            manager,
            data: {
              productsHandleShippingProfileMap,
              products,
            },
          })
        },
      },

      [CreateProductsWorkflowActions.attachToSalesChannel]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductsWorkflowInputData,
          { invoke }
        ) => {
          const products = invoke[
            CreateProductsWorkflowActions.createProducts
          ] as ProductTypes.ProductDTO[]
          const { productsHandleSalesChannelsMap } = invoke[
            CreateProductsWorkflowActions.prepare
          ] as CreateProductsPreparedData

          return await attachSalesChannelToProducts({
            container,
            manager,
            data: {
              productsHandleSalesChannelsMap,
              products,
            },
          })
        },
        [TransactionHandlerType.COMPENSATE]: async (
          data: CreateProductsWorkflowInputData,
          { invoke }
        ) => {
          const products = invoke[
            CreateProductsWorkflowActions.createProducts
          ] as ProductTypes.ProductDTO[]
          const { productsHandleSalesChannelsMap } = invoke[
            CreateProductsWorkflowActions.prepare
          ] as CreateProductsPreparedData

          return await detachSalesChannelFromProducts({
            container,
            manager,
            data: {
              productsHandleSalesChannelsMap,
              products,
            },
          })
        },
      },

      [CreateProductsWorkflowActions.createInventoryItems]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductsWorkflowInputData,
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
          data: CreateProductsWorkflowInputData,
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

      [CreateProductsWorkflowActions.createPrices]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductsWorkflowInputData,
          { invoke }
        ) => {
          const { productsHandleVariantsIndexPricesMap } = invoke[
            CreateProductsWorkflowActions.prepare
          ] as CreateProductsPreparedData
          const products = invoke[
            CreateProductsWorkflowActions.createProducts
          ] as ProductTypes.ProductDTO[]

          return await createProductsVariantsPrices({
            container,
            manager,
            data: {
              products,
              productsHandleVariantsIndexPricesMap,
            },
          })
        },
      },

      [CreateProductsWorkflowActions.result]: {
        [TransactionHandlerType.INVOKE]: async (
          data: CreateProductsWorkflowInputData,
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
