import {
  FilterableProductProps,
  RemoteQueryFunction,
} from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export type GetAllProductsStepInput = {
  select: string[]
  filter?: FilterableProductProps
}

export const getAllProductsStepId = "get-all-products"
/**
 * This step retrieves all products.
 */
export const getAllProductsStep = createStep(
  getAllProductsStepId,
  async (data: GetAllProductsStepInput, { container }) => {
    const remoteQuery: RemoteQueryFunction = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const allProducts: any[] = []
    const pageSize = 200
    let page = 0

    // We intentionally fetch the products serially here to avoid putting too much load on the DB
    while (true) {
      const { rows: products } = await remoteQuery({
        entryPoint: "product",
        variables: {
          filters: data.filter,
          skip: page * pageSize,
          take: pageSize,
        },
        fields: data.select,
      })

      allProducts.push(...products)

      if (products.length < pageSize) {
        break
      }

      page += 1
    }

    return new StepResponse(allProducts, allProducts)
  }
)
