import {
  ContainerRegistrationKeys,
  deduplicate,
  Modules,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { WorkflowTypes } from "@medusajs/types"
import { normalizeForExport } from "../helpers/normalize-for-export"
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

    let page = 0
    let hasHeader = false

    const fields = deduplicate(["id", "handle", ...input.select])
    const { sales_channel_id, ..._filters } = input.filter ?? {}

    while (true) {
      let linkPageLength: number | undefined

      if (!!sales_channel_id) {
        const { data: salesChannelProducts } = await query.graph({
          entity: "product_sales_channel",
          filters: {
            sales_channel_id,
          },
          fields: ["product_id"],
          pagination: {
            skip: page * pageSize,
            take: pageSize,
          },
        })

        linkPageLength = salesChannelProducts.length
        _filters.id = salesChannelProducts.map((product) => product.product_id)

        if (linkPageLength === 0) {
          break
        }
      }

      const { data: products } = await query.graph({
        entity: "product",
        fields,
        filters: _filters,
        // If sales channel is specified, we already paginated
        pagination: sales_channel_id
          ? undefined
          : {
              skip: page * pageSize,
              take: pageSize,
            },
      })

      if (products.length === 0 && linkPageLength === undefined) {
        break
      }

      // A page of the link table can be emptied entirely by the remaining
      // filters, which is not the end of the export.
      if (products.length > 0) {
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
      }

      // When a sales channel is given, the cursor above advances over the
      // product_sales_channel link table, so its page length is what says
      // whether another page exists. The product query is filtered and
      // de-duplicated, so it can return fewer rows than the link page
      // without the channel being exhausted.
      if ((linkPageLength ?? products.length) < pageSize) {
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
