import {
  ContainerRegistrationKeys,
  deduplicate,
  Modules,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { WorkflowTypes } from "@medusajs/framework/types"
import { json2csv } from "json-2-csv"
import { normalizeForExport } from "../helpers/normalize-for-export"

/**
 * The step ID for exporting inventory items.
 */
export const exportInventoryItemsStepId = "export-inventory-items"

const DEFAULT_BATCH_SIZE = 50

/**
 * This step exports inventory items to a CSV file based on the provided filters.
 * The exported file includes the inventory levels of each item per stock location.
 *
 * @example
 * To export all inventory items:
 *
 * ```ts
 * const data = exportInventoryItemsStep({
 *   select: ["id", "sku", "title"],
 *   batch_size: 100
 * })
 * ```
 *
 * To export inventory items stocked in a specific location:
 *
 * ```ts
 * const data = exportInventoryItemsStep({
 *   select: ["id", "sku", "title"],
 *   filter: {
 *     location_levels: {
 *       location_id: "sloc_123"
 *     }
 *   }
 * })
 * ```
 */
export const exportInventoryItemsStep = createStep(
  exportInventoryItemsStepId,
  async (
    input: WorkflowTypes.InventoryWorkflow.ExportInventoryItemsDTO,
    { container }
  ) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const fileModule = container.resolve(Modules.FILE)
    const stockLocationModule = container.resolve(Modules.STOCK_LOCATION)

    const locations = await stockLocationModule.listStockLocations(
      {},
      { select: ["id", "name"] }
    )
    locations.sort((a, b) => a.name.localeCompare(b.name))

    const filename = `${Date.now()}-inventory-item-exports.csv`
    const { writeStream, promise, fileKey } = await fileModule.getUploadStream({
      filename,
      mimeType: "text/csv",
    })

    const pageSize = !isNaN(parseInt(input?.batch_size as string))
      ? parseInt(input?.batch_size as string, 10)
      : DEFAULT_BATCH_SIZE

    let page = 0
    let hasHeader = false

    const fields = deduplicate([
      "id",
      "sku",
      // The export creates one row per linked product variant.
      "variants.id",
      "variants.title",
      "variants.barcode",
      "variants.ean",
      "variants.upc",
      ...input.select,
    ])
    if (!fields.some((field) => field.includes("location_levels"))) {
      fields.push("location_levels.*")
    }

    while (true) {
      const { data: inventoryItems } = await query.graph({
        entity: "inventory_items",
        fields,
        filters: input.filter ?? {},
        pagination: {
          skip: page * pageSize,
          take: pageSize,
        },
      })

      if (inventoryItems.length === 0) {
        break
      }

      const normalizedItems = normalizeForExport(inventoryItems, { locations })

      const batchCsv = json2csv(normalizedItems, {
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

      if (inventoryItems.length < pageSize) {
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
