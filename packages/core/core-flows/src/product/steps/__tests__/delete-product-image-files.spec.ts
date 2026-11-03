import { MedusaContainer } from "@medusajs/framework"
import { asValue, createContainer } from "@medusajs/framework/awilix"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk"
import { deleteProductImageFilesStep } from "../delete-product-image-files"

const runStep = async (container: MedusaContainer, input: string[]) => {
  const workflow = createWorkflow(
    `delete-product-image-files-test-${Math.random().toString(36).slice(2)}`,
    () => {
      const out = deleteProductImageFilesStep(input)
      return new WorkflowResponse(out)
    }
  )

  return workflow(container).run({ input: {} })
}

const buildContainer = ({
  provider,
  logger,
}: {
  provider: Record<string, any>
  logger?: Record<string, any>
}) => {
  const container = createContainer() as unknown as MedusaContainer

  container.register(
    Modules.FILE,
    asValue({
      getProvider: () => provider,
    })
  )
  container.register(
    ContainerRegistrationKeys.LOGGER,
    asValue({ warn: jest.fn(), ...logger })
  )

  return container
}

describe("deleteProductImageFilesStep", () => {
  it("deletes every orphaned image file", async () => {
    const deleteByUrl = jest.fn().mockResolvedValue(undefined)
    const container = buildContainer({ provider: { deleteByUrl } })

    await runStep(container, [
      "https://bucket.s3.amazonaws.com/one.png",
      "https://bucket.s3.amazonaws.com/two.png",
    ])

    expect(deleteByUrl).toHaveBeenCalledTimes(2)
    expect(deleteByUrl).toHaveBeenNthCalledWith(
      1,
      "https://bucket.s3.amazonaws.com/one.png"
    )
    expect(deleteByUrl).toHaveBeenNthCalledWith(
      2,
      "https://bucket.s3.amazonaws.com/two.png"
    )
  })

  it("does nothing when there are no URLs", async () => {
    const deleteByUrl = jest.fn()
    const container = buildContainer({ provider: { deleteByUrl } })

    await runStep(container, [])

    expect(deleteByUrl).not.toHaveBeenCalled()
  })

  it("does nothing when the provider doesn't support deleting by URL", async () => {
    const container = buildContainer({ provider: { delete: jest.fn() } })

    await expect(
      runStep(container, ["https://example.com/image.png"])
    ).resolves.toBeDefined()
  })

  it("logs a failed deletion and keeps deleting the remaining files", async () => {
    const deleteByUrl = jest
      .fn()
      .mockRejectedValueOnce(new Error("storage unavailable"))
      .mockResolvedValueOnce(undefined)
    const logger = { warn: jest.fn() }
    const container = buildContainer({ provider: { deleteByUrl }, logger })

    await runStep(container, [
      "https://bucket.s3.amazonaws.com/one.png",
      "https://bucket.s3.amazonaws.com/two.png",
    ])

    expect(deleteByUrl).toHaveBeenCalledTimes(2)
    expect(logger.warn).toHaveBeenCalledTimes(1)
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("storage unavailable")
    )
  })
})
