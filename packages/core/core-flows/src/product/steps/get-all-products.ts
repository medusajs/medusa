import { FilterableProductProps, RemoteQueryFunction } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type StepInput = {
  select: string[]
  filter?: FilterableProductProps
}

export const getAllProductsStepId = "get-all-products"
export const getAllProductsStep = createStep(
  getAllProductsStepId,
  async (data: StepInput, { container }) => {
    const remoteQuery: RemoteQueryFunction = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const allProducts: any[] = []
    const pageSize = 500
    let page = 0

    // We intentionally fetch the products serially here to avoid putting too much load on the DB
    while (true) {
      const remoteQueryObject = remoteQueryObjectFromString({
        entryPoint: "product",
        variables: {
          filters: data.filter,
          skip: page * pageSize,
          take: pageSize,
        },
        fields: data.select,
      })

      const { rows: products } = await remoteQuery(remoteQueryObject)
      allProducts.push(...products)

      if (products.length < pageSize) {
        break
      }

      page += 1
    }

    return new StepResponse(allProducts, allProducts)
  }
)
