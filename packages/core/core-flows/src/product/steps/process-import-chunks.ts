import { Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"
import { batchProductsWorkflow } from "../workflows/batch-products"

export const processImportChunksStepId = "process-import-chunks"

/**
 * This step parses a CSV file holding products to import, returning the products as
 * objects that can be imported.
 *
 * @example
 * const data = parseProductCsvStep("products.csv")
 */
export const processImportChunksStep = createStep(
  {
    name: processImportChunksStepId,
    async: true,
  },
  async (input: { chunks: { id: string }[] }, { container }) => {
    const file = container.resolve(Modules.FILE)

    try {
      for (let chunk of input.chunks) {
        const contents = await file.getAsBuffer(chunk.id)
        let products = JSON.parse(contents.toString("utf-8"))
        await batchProductsWorkflow(container).run({
          input: products,
        })
        products = undefined
      }
    } finally {
      /**
       * Delete chunks regardless of the import status
       */
      await file.deleteFiles(input.chunks.map((chunk) => chunk.id))
    }

    return new StepResponse({ completed: true })
  }
)
