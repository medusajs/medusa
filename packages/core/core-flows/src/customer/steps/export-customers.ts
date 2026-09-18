import { IFileModuleService } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  deduplicate,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Writable } from "stream"
import { json2csv } from "json-2-csv"

import { normalizeCustomerForExport } from "../helpers/normalize-for-export"

export type ExportCustomersStepInput = {
  /**
   * Additional fields to select and include in the export. These are passed
   * to Query, so they can be customer properties or any relation/link names
   * (including custom links).
   */
  select: string[]
  /**
   * The IDs of the customers to export, as resolved by
   * {@link collectCustomerIdsToExportStep}.
   */
  customer_ids: string[]
  /**
   * The batch size to use when querying customers.
   */
  batch_size?: number | string
  /**
   * The format of the exported file. Defaults to `json`, which produces a
   * lossless, nested representation suitable for GDPR subject-access requests.
   * Use `csv` for a flattened, spreadsheet-friendly export.
   */
  format?: "csv" | "json"
  /**
   * The PII slices contributed by custom modules through the
   * `customerDataExport` hook, keyed by customer ID.
   */
  additional_data?: Record<string, Record<string, unknown>>
}

export type ExportCustomersStepOutput = {
  /**
   * The ID (key) of the exported file in the File Module.
   */
  id: string
  /**
   * The name of the exported file.
   */
  filename: string
}

export const exportCustomersStepId = "export-customers"

/**
 * The default set of customer fields and relations included in the export.
 * These cover the customer's own PII as well as the personal data linked to
 * them across modules (addresses, group membership, orders, carts, and payment
 * account holders).
 */
const DEFAULT_FIELDS = [
  "id",
  "email",
  "first_name",
  "last_name",
  "company_name",
  "phone",
  "has_account",
  "created_by",
  "created_at",
  "updated_at",
  "metadata",
  "addresses.*",
  "groups.id",
  "groups.name",
  "orders.id",
  "orders.display_id",
  "orders.status",
  "orders.email",
  "orders.currency_code",
  "orders.total",
  "orders.created_at",
]

const writeToStream = async (writeStream: Writable, data: string) => {
  const ok = writeStream.write(data)
  if (!ok) {
    await new Promise((resolve) => writeStream.once("drain", resolve))
  }
}

/**
 * This step exports the specified customers' data to a file, uploaded through
 * the File Module. The data of each customer is merged with any PII slices
 * contributed by custom modules through the `customerDataExport` hook.
 *
 * The customers are streamed to the file in batches to keep memory bounded.
 * On failure, the compensation deletes the uploaded file.
 */
export const exportCustomersStep = createStep(
  exportCustomersStepId,
  async (input: ExportCustomersStepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const fileModule = container.resolve(Modules.FILE)

    const format = input.format === "csv" ? "csv" : "json"
    const extension = format === "csv" ? "csv" : "json"
    const mimeType = format === "csv" ? "text/csv" : "application/json"

    const filename = `${Date.now()}-customer-exports.${extension}`
    const { writeStream, promise, fileKey } = await fileModule.getUploadStream({
      filename,
      mimeType,
    })

    const additionalData = input.additional_data ?? {}
    const customerIds = input.customer_ids ?? []

    const pageSize = !isNaN(parseInt(input?.batch_size as string))
      ? parseInt(input?.batch_size as string, 10)
      : 50

    const fields = deduplicate([...DEFAULT_FIELDS, ...(input.select ?? [])])

    let hasHeader = false
    let hasWrittenRecord = false

    if (format === "json") {
      await writeToStream(writeStream, "[")
    }

    for (let i = 0; i < customerIds.length; i += pageSize) {
      const idsBatch = customerIds.slice(i, i + pageSize)

      const { data: customers } = await query.graph({
        entity: "customer",
        filters: { id: idsBatch },
        fields,
      })

      if (customers.length === 0) {
        continue
      }

      const records = customers.map((customer) =>
        normalizeCustomerForExport(customer, additionalData[customer.id])
      )

      if (format === "json") {
        const chunk = records.map((record) => JSON.stringify(record)).join(",")
        await writeToStream(writeStream, (hasWrittenRecord ? "," : "") + chunk)
        hasWrittenRecord = true
      } else {
        const batchCsv = json2csv(records, {
          prependHeader: !hasHeader,
          arrayIndexesAsKeys: true,
          expandNestedObjects: true,
          expandArrayObjects: true,
          unwindArrays: false,
          preventCsvInjection: true,
          emptyFieldValue: "",
        })

        await writeToStream(writeStream, (hasHeader ? "\n" : "") + batchCsv)
        hasHeader = true
      }
    }

    if (format === "json") {
      await writeToStream(writeStream, "]")
    }

    writeStream.end()

    await promise

    return new StepResponse(
      { id: fileKey, filename } as ExportCustomersStepOutput,
      fileKey
    )
  },
  async (fileId, { container }) => {
    if (!fileId) {
      return
    }

    const fileModule: IFileModuleService = container.resolve(Modules.FILE)
    await fileModule.deleteFiles(fileId)
  }
)
