import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk"
import { deleteProductImageFilesStep } from "../delete-product-image-files"

describe("deleteProductImageFilesStep", () => {
  const logger = { warn: jest.fn(), error: jest.fn(), info: jest.fn() }

  const buildContainer = (provider: Record<string, unknown>) => {
    const container = createContainer() as unknown as MedusaContainer

    container.register(
      ContainerRegistrationKeys.LOGGER,
      asFunction(() => logger as any)
    )
    container.register(
      Modules.FILE,
      asFunction(() => ({ getProvider: () => provider } as any))
    )

    return container
  }

  const runWith = async (
    id: string,
    provider: Record<string, unknown>,
    urls: string[]
  ) => {
    const workflow = createWorkflow(id, () => {
      return new WorkflowResponse(deleteProductImageFilesStep({ urls }))
    })

    return await workflow(buildContainer(provider)).run()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("does nothing when no image was orphaned", async () => {
    const deleteByUrl = jest.fn()

    await runWith("delete-product-image-files-empty", { deleteByUrl }, [])

    expect(deleteByUrl).not.toHaveBeenCalled()
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it("deletes the file of every orphaned image", async () => {
    const deleteByUrl = jest.fn().mockResolvedValue(undefined)

    await runWith("delete-product-image-files-happy", { deleteByUrl }, [
      "https://bucket.s3.amazonaws.com/a.png",
      "https://bucket.s3.amazonaws.com/b.png",
    ])

    expect(deleteByUrl).toHaveBeenCalledTimes(2)
    expect(deleteByUrl).toHaveBeenCalledWith(
      "https://bucket.s3.amazonaws.com/a.png"
    )
    expect(deleteByUrl).toHaveBeenCalledWith(
      "https://bucket.s3.amazonaws.com/b.png"
    )
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it("is a no-op when the provider cannot delete by URL", async () => {
    const { errors } = await runWith(
      "delete-product-image-files-unsupported",
      {},
      ["https://bucket.s3.amazonaws.com/a.png"]
    )

    expect(errors).toEqual([])
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it("logs a failed deletion and still deletes the remaining files", async () => {
    const deleteByUrl = jest
      .fn()
      .mockRejectedValueOnce(new Error("storage unreachable"))
      .mockResolvedValue(undefined)

    const { errors } = await runWith(
      "delete-product-image-files-partial-failure",
      { deleteByUrl },
      [
        "https://bucket.s3.amazonaws.com/a.png",
        "https://bucket.s3.amazonaws.com/b.png",
      ]
    )

    expect(errors).toEqual([])
    expect(deleteByUrl).toHaveBeenCalledTimes(2)
    expect(logger.warn).toHaveBeenCalledTimes(1)
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("https://bucket.s3.amazonaws.com/a.png")
    )
  })
})
