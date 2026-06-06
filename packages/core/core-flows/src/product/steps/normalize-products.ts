import type { HttpTypes } from "@zjedene-medusa/framework/types"
import { CSVNormalizer, productValidators } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"
import { convertCsvToJson } from "../utils"

/**
 * The CSV file content to parse.
 */
export type NormalizeProductCsvStepInput = string

export const normalizeCsvStepId = "normalize-product-csv"
/**
 * This step parses a CSV file holding products to import, returning the products as
 * objects that can be imported.
 *
 * @example
 * const data = parseProductCsvStep("products.csv")
 */
export const normalizeCsvStep = createStep(
  normalizeCsvStepId,
  async (fileContent: NormalizeProductCsvStepInput) => {
    const csvProducts =
      convertCsvToJson<Record<string, number | string | boolean>>(fileContent)
    const normalizer = new CSVNormalizer(
      csvProducts.map((row, index) => CSVNormalizer.preProcess(row, index + 1))
    )
    const products = normalizer.proccess()

    const create = Object.keys(products.toCreate).reduce<
      HttpTypes.AdminCreateProduct[]
    >((result, toCreateHandle) => {
      result.push(
        productValidators.CreateProduct.parse(
          products.toCreate[toCreateHandle]
        ) as HttpTypes.AdminCreateProduct
      )
      return result
    }, [])

    const update = Object.keys(products.toUpdate).reduce<
      HttpTypes.AdminUpdateProduct & { id: string }[]
    >((result, toUpdateId) => {
      result.push(
        productValidators.UpdateProduct.parse(products.toUpdate[toUpdateId])
      )
      return result
    }, [])

    return new StepResponse({
      create,
      update,
    })
  }
)
