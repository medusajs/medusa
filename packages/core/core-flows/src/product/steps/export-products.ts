import {
  ContainerRegistrationKeys,
  deduplicate,
  Modules,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { WorkflowTypes } from "@medusajs/framework/types"
import { normalizeForExport } from "../helpers/normalize-for-export"
import { appendProductExportKeys } from "../helpers/product-export-keys"
import { json2csv } from "json-2-csv"
/**
 * The step ID for exporting products.
 */
export const exportProductsStepId = "export-products"

const DEFAULT_BATCH_SIZE = 50

/**
 * This step exports products to a CSV file based on the provided filters.
 * 
 * @example
 * To export all products:
 * 
 * ```ts
 * const data = exportProductsStep({
 *   select: ["id", "title", "handle"],
 *   batch_size: 100
 * })
 * ```
 * 
 * To export products from a specific sales channel:
 * 
 * ```ts
 * const data = exportProductsStep({
 *   select: ["id", "title", "handle"],
 *   filter: {
 *     sales_channel_id: "sc_123"
 *   }
 * })
 * ```
 */
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

    const fields = deduplicate(["id", "handle", ...input.select])
    const { sales_channel_id, ..._filters } = input.filter ?? {}

    const getProducts = async (page: number) => {
      if (!!sales_channel_id) {
        const { data: salesChannelProducts } = await query.graph({
          entity: "product_sales_channel",
          filters: { sales_channel_id },
          fields: ["product_id"],
          pagination: { skip: page * pageSize, take: pageSize, order: { product_id: "ASC" } as any },
        })
        _filters.id = salesChannelProducts.map((p) => p.product_id)
      }

      const { data: products } = await query.graph({
        entity: "product",
        fields,
        filters: _filters,
        pagination: sales_channel_id
          ? undefined
          : { skip: page * pageSize, take: pageSize, order: { id: "ASC" } },
      })

      return products
    }

    const exportOptions = {
      arrayIndexesAsKeys: true,
      expandNestedObjects: true,
      expandArrayObjects: true,
      ignoreEmptyArraysWhenExpanding: true,
      escapeNestedDots: true,
    }

    const seenExportKeys = new Set<string>()
    const allProductIds: string[] = []
    let page = 0
    while (true) {
      const products = await getProducts(page)
      if (products.length === 0) break

      const normalizedProducts = normalizeForExport(products, { regions })
      allProductIds.push(...products.map((p: any) => p.id))
      appendProductExportKeys(normalizedProducts, seenExportKeys, exportOptions)

      if (products.length < pageSize) break
      page += 1
    }

    const exportKeys = Array.from(seenExportKeys)
    let hasHeader = false
    
    for (let i = 0; i < allProductIds.length; i += pageSize) {
      const batchIds = allProductIds.slice(i, i + pageSize)
      const { data: products } = await query.graph({
        entity: "product",
        fields,
        filters: { id: batchIds },
      })

      const normalizedProducts = normalizeForExport(products, { regions })
      
      const batchCsv = json2csv(normalizedProducts, {
        keys: exportKeys,
        prependHeader: !hasHeader,
        ...exportOptions,
        unwindArrays: false,
        preventCsvInjection: true,
        emptyFieldValue: "",
      })

      const ok = writeStream.write((hasHeader ? "\n" : "") + batchCsv)
      if (!ok) {
        await new Promise((resolve) => writeStream.once("drain", resolve))
      }

      hasHeader = true
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
