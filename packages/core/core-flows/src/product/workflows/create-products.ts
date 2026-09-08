import {
  AdditionalData,
  CreateProductWorkflowInputDTO,
  LinkDefinition,
  PricingTypes,
  ProductTypes,
} from "@medusajs/framework/types"
import {
  ProductWorkflowEvents,
  isPresent,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep, emitEventStep } from "../../common"
import { associateProductsWithSalesChannelsStep } from "../../sales-channel"
import { createProductsStep } from "../steps/create-products"
import { createProductVariantsWorkflow } from "./create-product-variants"

/**
 * The product's data to validate.
 */
export interface ValidateProductInputStepInput {
  /**
   * The products to validate.
   */
  products: Omit<CreateProductWorkflowInputDTO, "sales_channels">[]
}

const validateProductInputStepId = "validate-product-input"
/**
 * This step validates that all provided products have options.
 * If a product is missing options or a shipping profile, an error is thrown.
 *
 * @example
 * const data = validateProductInputStep({
 *   products: [
 *     {
 *       title: "Shirt",
 *       options: [
 *         {
 *           title: "Size",
 *           values: ["S", "M", "L"]
 *         }
 *       ],
 *       variants: [
 *         {
 *           title: "Small Shirt",
 *           sku: "SMALLSHIRT",
 *           options: {
 *             Size: "S"
 *           },
 *           prices: [
 *             {
 *               amount: 10,
 *               currency_code: "usd"
 *             }
 *           ],
 *           manage_inventory: true,
 *         },
 *       ]
 *     }
 *   ]
 * })
 */
export const validateProductInputStep = createStep(
  validateProductInputStepId,
  async (data: ValidateProductInputStepInput) => {
    const { products } = data

    const missingOptionsProductTitles = products
      .filter((product) => !product.options?.length)
      .map((product) => product.title)

    if (missingOptionsProductTitles.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Product options are not provided for: [${missingOptionsProductTitles.join(
          ", "
        )}].`
      )
    }
  }
)

/**
 * The data to create one or more products, along with custom data that's passed to the workflow's hooks.
 */
export type CreateProductsWorkflowInput = {
  /**
   * The products to create.
   */
  products: CreateProductWorkflowInputDTO[]
} & AdditionalData

export const createProductsWorkflowId = "create-products"
/**
 * This workflow creates one or more products. It's used by the [Create Product Admin API Route](https://docs.medusajs.com/api/admin/products/create-product).
 * It can also be useful to you when creating [seed scripts](https://docs.medusajs.com/learn/fundamentals/custom-cli-scripts/seed-data), for example.
 *
 * This workflow has a hook that allows you to perform custom actions on the created products. You can see an example in [this guide](https://docs.medusajs.com/resources/commerce-modules/product/extend).
 *
 * You can also use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around product creation.
 * 
 * :::note
 * 
 * Learn more about adding rules to the product variant's prices in the Pricing Module's 
 * [Price Rules](https://docs.medusajs.com/resources/commerce-modules/pricing/price-rules) documentation.
 * 
 * :::
 *
 * @example
 * const { result } = await createProductsWorkflow(container)
 * .run({
 *   input: {
 *     products: [
 *       {
 *         title: "Shirt",
 *         options: [
 *           {
 *             title: "Size",
 *             values: ["S", "M", "L"]
 *           }
 *         ],
 *         variants: [
 *           {
 *             title: "Small Shirt",
 *             sku: "SMALLSHIRT",
 *             options: {
 *               Size: "S"
 *             },
 *             prices: [
 *               {
 *                 amount: 10,
 *                 currency_code: "usd"
 *               }
 *             ],
 *             manage_inventory: true,
 *           },
 *         ],
 *         shipping_profile_id: "sp_123",
 *       }
 *     ],
 *     additional_data: {
 *       erp_id: "123"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Create one or more products with options and variants.
 *
 * @property hooks.productsCreated - This hook is executed after the products are created. You can consume this hook to perform custom actions on the created products.
 */
export const createProductsWorkflow = createWorkflow(
  createProductsWorkflowId,
  (input: WorkflowData<CreateProductsWorkflowInput>) => {
    // Passing prices to the product module will fail, we want to keep them for after the product is created.
    const { products: productWithoutExternalRelations } = transform(
      { input },
      (data) => {
        const productsData = data.input.products.map((p) => {
          return {
            ...p,
            sales_channels: undefined,
            shipping_profile_id: undefined,
            variants: undefined,
          }
        })

        return { products: productsData }
      }
    )

    validateProductInputStep({ products: input.products })

    const createdProducts = createProductsStep(productWithoutExternalRelations)

    const salesChannelLinks = transform({ input, createdProducts }, (data) => {
      return data.createdProducts
        .map((createdProduct, i) => {
          const inputProduct = data.input.products[i]
          return (
            inputProduct.sales_channels?.map((salesChannel) => ({
              sales_channel_id: salesChannel.id,
              product_id: createdProduct.id,
            })) ?? []
          )
        })
        .flat()
    })

    associateProductsWithSalesChannelsStep({ links: salesChannelLinks })

    const shippingProfileLinks = transform(
      { input, createdProducts },
      (data) => {
        return data.createdProducts
          .map((createdProduct, i) => {
            return {
              [Modules.PRODUCT]: {
                product_id: createdProduct.id,
              },
              [Modules.FULFILLMENT]: {
                shipping_profile_id: data.input.products[i].shipping_profile_id,
              },
            }
          })
          .filter((link) => !!link[Modules.FULFILLMENT].shipping_profile_id)
      }
    )

    createRemoteLinkStep(shippingProfileLinks as LinkDefinition[])

    const variantsInput = transform({ input, createdProducts }, (data) => {
      // TODO: Move this to a unified place for all product workflow types
      const productVariants: (ProductTypes.CreateProductVariantDTO & {
        prices?: PricingTypes.CreateMoneyAmountDTO[]
      })[] = []

      data.createdProducts.forEach((product, i) => {
        const inputProduct = data.input.products[i]

        for (const inputVariant of inputProduct.variants || []) {
          isPresent(inputVariant) &&
            productVariants.push({
              product_id: product.id,
              ...inputVariant,
            })
        }
      })

      return {
        input: { product_variants: productVariants },
      }
    })

    const createdVariants =
      createProductVariantsWorkflow.runAsStep(variantsInput)

    const response = transform(
      { createdVariants, input, createdProducts },
      (data) => {
        const variantMap: Record<string, ProductTypes.ProductVariantDTO[]> = {}

        for (const variant of data.createdVariants) {
          const array = variantMap[variant.product_id!] || []

          array.push(variant)

          variantMap[variant.product_id!] = array
        }

        for (const product of data.createdProducts) {
          product.variants = variantMap[product.id] || []
        }

        return data.createdProducts
      }
    )

    const productIdEvents = transform({ response }, ({ response }) => {
      return response.map((v) => {
        return { id: v.id }
      })
    })

    emitEventStep({
      eventName: ProductWorkflowEvents.CREATED,
      data: productIdEvents,
    })

    const productsCreated = createHook("productsCreated", {
      products: response,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(response, {
      hooks: [productsCreated],
    })
  }
)
