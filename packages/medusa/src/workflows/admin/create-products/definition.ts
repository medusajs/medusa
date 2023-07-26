import {
  TransactionHandlerType,
  TransactionPayload,
  TransactionStepHandler,
  TransactionStepsDefinition,
} from "@medusajs/orchestration"
import {
  IInventoryService,
  MedusaContainer,
  ProductTypes,
} from "@medusajs/types"
import {
  defaultAdminProductFields,
  defaultAdminProductRelations,
} from "../../../api"
import {
  attachInventoryItems,
  attachSalesChannelToProducts,
  attachShippingProfileToProducts,
  createInventoryItems,
  createProducts,
  CreateProductsData,
  CreateProductsPreparedData,
  detachInventoryItems,
  detachSalesChannelFromProducts,
  detachShippingProfileFromProducts,
  prepareCreateProductsData,
  removeInventoryItems,
  removeProducts,
  updateProductsVariantsPrices,
} from "../../functions"
import { PricingService, ProductService } from "../../../services"
import { CreateProductsWorkflowInputData, InjectedDependencies } from "./types"

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

export const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: CreateProductsWorkflowActions.prepare,
    noCompensation: true,
    next: {
      action: CreateProductsWorkflowActions.createProducts,
      next: [
        {
          action: CreateProductsWorkflowActions.attachShippingProfile,
          saveResponse: false,
        },
        {
          action: CreateProductsWorkflowActions.attachToSalesChannel,
          saveResponse: false,
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
              },
            },
          },
        },
      ],
    },
  },
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

export function transactionHandler(
  dependencies: InjectedDependencies
): TransactionStepHandler {
  const { manager, container } = dependencies

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

        if (!products?.length) {
          return
        }

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
        const { productsHandleShippingProfileIdMap } = invoke[
          CreateProductsWorkflowActions.prepare
        ] as CreateProductsPreparedData

        return await attachShippingProfileToProducts({
          container,
          manager,
          data: {
            productsHandleShippingProfileIdMap,
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
        const { productsHandleShippingProfileIdMap } = invoke[
          CreateProductsWorkflowActions.prepare
        ] as CreateProductsPreparedData

        return await detachShippingProfileFromProducts({
          container,
          manager,
          data: {
            productsHandleShippingProfileIdMap,
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

        const variantInventoryItemsData =
          invoke[CreateProductsWorkflowActions.createInventoryItems]

        if (shouldSkipStep_ || !variantInventoryItemsData?.length) {
          return
        }

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
      [TransactionHandlerType.COMPENSATE]: async (
        data: CreateProductsWorkflowInputData,
        { invoke }
      ) => {
        const shouldSkipStep_ = shouldSkipInventoryStep(
          container,
          CreateProductsWorkflowActions.attachInventoryItems
        )

        const {
          [CreateProductsWorkflowActions.createInventoryItems]:
            inventoryItemsResult,
        } = invoke

        if (shouldSkipStep_ || !inventoryItemsResult?.length) {
          return
        }

        return await detachInventoryItems({
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

        return await updateProductsVariantsPrices({
          container,
          manager,
          data: {
            products,
            productsHandleVariantsIndexPricesMap,
          },
        })
      },
      [TransactionHandlerType.COMPENSATE]: async (
        data: CreateProductsWorkflowInputData,
        { invoke }
      ) => {
        const { productsHandleVariantsIndexPricesMap } = invoke[
          CreateProductsWorkflowActions.prepare
        ] as CreateProductsPreparedData
        const products = invoke[
          CreateProductsWorkflowActions.createProducts
        ] as ProductTypes.ProductDTO[]

        if (!productsHandleVariantsIndexPricesMap?.size) {
          return
        }

        const updatedProductsHandleVariantsIndexPricesMap = new Map()
        productsHandleVariantsIndexPricesMap.forEach((items, productHandle) => {
          const existingItems =
            updatedProductsHandleVariantsIndexPricesMap.get(productHandle) ?? []

          items.forEach(({ index }) => {
            existingItems.push({
              index,
              prices: [],
            })
          })

          updatedProductsHandleVariantsIndexPricesMap.set(productHandle, items)
        })

        return await updateProductsVariantsPrices({
          container,
          manager,
          data: {
            products,
            productsHandleVariantsIndexPricesMap:
              updatedProductsHandleVariantsIndexPricesMap,
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

        const res = await pricingService
          .withTransaction(manager)
          .setProductPrices([rawProduct])

        return res
      },
    },
  }

  return (
    actionId: string,
    type: TransactionHandlerType,
    payload: TransactionPayload
  ) => command[actionId][type](payload.data, payload.context)
}
