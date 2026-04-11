import {
  ContainerRegistrationKeys,
  deduplicate,
  Modules,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { WorkflowTypes } from "@medusajs/types"
import { normalizeForExport } from "../helpers/normalize-for-export"
import { json2csv } from "json-2-csv"

export const exportProductsStepId = "export-products"

const DEFAULT_BATCH_SIZE = 50

export const exportProductsStep = createStep(
  exportProductsStepId,
  async (
    input: WorkflowTypes.ProductWorkflow.ExportProductsDTO,
    { container }
  ) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const fileModule = container.resolve(Modules.FILE)
    const regionModule = container.resolve(Modules.REGION)

    const regions = await regionModule.listRegions(
      {},
      { select: ["id", "name", "currency_code"] }
    )

    const filename = `${Date.now()}-product-exports.csv`
    const { writeStream, promise, fileKey } = await fileModule.getUploadStream({
      filename,
      mimeType: "text/csv",
    })

    const pageSize = !isNaN(parseInt(input?.batch_size as string))
      ? parseInt(input?.batch_size as string, 10)
      : DEFAULT_BATCH_SIZE

    let page = 0
    let hasHeader = false

    const fields = deduplicate(["id", "handle", ...input.select])

    while (true) {
      const { data: products } = await query.graph({
        entity: "product",
        fields,
        filters: input.filter,
        pagination: {
          skip: page * pageSize,
          take: pageSize,
        },
      })

      if (products.length === 0) {
        break
      }

      const normalizedProducts = normalizeForExport(products, { regions })

      const batchCsv = json2csv(normalizedProducts, {
        prependHeader: !hasHeader,
        arrayIndexesAsKeys: true,
        expandNestedObjects: true,
        expandArrayObjects: true,
        unwindArrays: false,
        preventCsvInjection: true,
        emptyFieldValue: "",
      })

      const ok = writeStream.write((hasHeader ? "\n" : "") + batchCsv)
      if (!ok) {
        await new Promise((resolve) => writeStream.once("drain", resolve))
      }

      hasHeader = true

      if (products.length < pageSize) {
        break
      }

      page += 1
    }

    writeStream.end()

    await promise

    return new StepResponse({ id: fileKey, filename }, fileKey)
  },
  async (fileId, { container }) => {
    if (!fileId) {
      return
    }

    const fileModule = container.resolve(Modules.FILE)
    await fileModule.deleteFiles(fileId)
  }
)
