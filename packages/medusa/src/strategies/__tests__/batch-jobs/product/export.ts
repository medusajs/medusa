import ProductExportStrategy from "../../../batch-jobs/product/export"
import { IdMap, MockManager } from "medusa-test-utils"
import { User } from "../../../../models"
import { BatchJobStatus } from "../../../../types/batch-job"
import { productsToExport } from "../../../__fixtures__/product-export-data"
import { AdminPostBatchesReq, defaultAdminProductRelations, } from "../../../../api"
import { ProductExportBatchJob } from "../../../batch-jobs/product/types"
import { Request } from "express"
import { FlagRouter } from "../../../../utils/flag-router"
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"

const productServiceMock = {
  withTransaction: function () {
    return this
  },
  list: jest.fn().mockImplementation(() => Promise.resolve(productsToExport)),

  count: jest
    .fn()
    .mockImplementation(() => Promise.resolve(productsToExport.length)),
  listAndCount: jest.fn().mockImplementation(() => {
    return Promise.resolve([productsToExport, productsToExport.length])
  }),
}
const productServiceWithNoDataMock = {
  ...productServiceMock,
  list: jest.fn().mockImplementation(() => Promise.resolve([])),
  count: jest.fn().mockImplementation(() => Promise.resolve(0)),
  listAndCount: jest.fn().mockImplementation(() => {
    return Promise.resolve([[], 0])
  }),
}
const managerMock = MockManager

describe("Product export strategy", () => {
  const outputDataStorage: string[] = []
  const fileServiceMock = {
    delete: jest.fn(),
    getUploadStreamDescriptor: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        writeStream: {
          write: (data: string) => {
            outputDataStorage.push(data)
          },
          end: () => void 0,
        },
        promise: Promise.resolve(),
        fileKey: "product-export.csv",
      })
    }),
    withTransaction: function () {
      return this
    },
  }
  let fakeJob = {
    id: IdMap.getId("product-export-job"),
    type: "product-export",
    created_by: IdMap.getId("product-export-job-creator"),
    created_by_user: {} as User,
    context: {},
    result: {},
    dry_run: false,
    status: BatchJobStatus.PROCESSING as BatchJobStatus,
  } as ProductExportBatchJob

  let canceledFakeJob = {
    ...fakeJob,
    id: "bj_failed",
    status: BatchJobStatus.CANCELED,
  } as ProductExportBatchJob

  const batchJobServiceMock = {
    withTransaction: function () {
      return this
    },
    update: jest.fn().mockImplementation((jobOrId, data) => {
      if ((jobOrId?.id ?? jobOrId) === "bj_failed") {
        canceledFakeJob = {
          ...canceledFakeJob,
          ...data,
          context: { ...canceledFakeJob?.context, ...data?.context },
          result: { ...canceledFakeJob?.result, ...data?.result },
        }

        return Promise.resolve(canceledFakeJob)
      }

      fakeJob = {
        ...fakeJob,
        ...data,
        context: { ...fakeJob?.context, ...data?.context },
        result: { ...fakeJob?.result, ...data?.result },
      }

      return Promise.resolve(fakeJob)
    }),
    updateStatus: jest.fn().mockImplementation((status) => {
      fakeJob.status = status
      return Promise.resolve(fakeJob)
    }),
    complete: jest.fn().mockImplementation(() => {
      fakeJob.status = BatchJobStatus.COMPLETED
      return Promise.resolve(fakeJob)
    }),
    retrieve: jest.fn().mockImplementation((id) => {
      const targetFakeJob = id === "bj_failed" ? canceledFakeJob : fakeJob
      return Promise.resolve(targetFakeJob)
    }),
    setFailed: jest.fn().mockImplementation((...args) => {
      console.error(...args)
    }),
  }

  const productExportStrategy = new ProductExportStrategy({
    manager: managerMock,
    fileService: fileServiceMock as any,
    batchJobService: batchJobServiceMock as any,
    productService: productServiceMock as any,
    featureFlagRouter: new FlagRouter({}),
  })

  it("should generate the appropriate template", async () => {
    await productExportStrategy.prepareBatchJobForProcessing(
      fakeJob,
      {} as Request
    )
    await productExportStrategy.preProcessBatchJob(fakeJob.id)
    const template = await productExportStrategy.buildHeader(fakeJob)
    expect(template).toMatch(/.*Product Id.*/)
    expect(template).toMatch(/.*Product Handle.*/)
    expect(template).toMatch(/.*Product Title.*/)
    expect(template).toMatch(/.*Product Subtitle.*/)
    expect(template).toMatch(/.*Product Description.*/)
    expect(template).toMatch(/.*Product Status.*/)
    expect(template).toMatch(/.*Product Thumbnail.*/)
    expect(template).toMatch(/.*Product Weight.*/)
    expect(template).toMatch(/.*Product Length.*/)
    expect(template).toMatch(/.*Product Width.*/)
    expect(template).toMatch(/.*Product Height.*/)
    expect(template).toMatch(/.*Product HS Code.*/)
    expect(template).toMatch(/.*Product Origin Country.*/)
    expect(template).toMatch(/.*Product MID Code.*/)
    expect(template).toMatch(/.*Product Material.*/)
    expect(template).toMatch(/.*Product Collection Title.*/)
    expect(template).toMatch(/.*Product Collection Handle.*/)
    expect(template).toMatch(/.*Product Type.*/)
    expect(template).toMatch(/.*Product Tags.*/)
    expect(template).toMatch(/.*Product Discountable.*/)
    expect(template).toMatch(/.*Product External Id.*/)
    expect(template).toMatch(/.*Product Profile Name.*/)
    expect(template).toMatch(/.*Product Profile Type.*/)
    expect(template).toMatch(/.*Product Profile Type.*/)

    expect(template).toMatch(/.*Variant Id.*/)
    expect(template).toMatch(/.*Variant Title.*/)
    expect(template).toMatch(/.*Variant SKU.*/)
    expect(template).toMatch(/.*Variant Barcode.*/)
    expect(template).toMatch(/.*Variant Allow Backorder.*/)
    expect(template).toMatch(/.*Variant Manage Inventory.*/)
    expect(template).toMatch(/.*Variant Weight.*/)
    expect(template).toMatch(/.*Variant Length.*/)
    expect(template).toMatch(/.*Variant Width.*/)
    expect(template).toMatch(/.*Variant Height.*/)
    expect(template).toMatch(/.*Variant HS Code.*/)
    expect(template).toMatch(/.*Variant Origin Country.*/)
    expect(template).toMatch(/.*Variant MID Code.*/)
    expect(template).toMatch(/.*Variant Material.*/)

    expect(template).toMatch(/.*Option 1 Name.*/)
    expect(template).toMatch(/.*Option 1 Value.*/)
    expect(template).toMatch(/.*Option 2 Name.*/)
    expect(template).toMatch(/.*Option 2 Value.*/)

    expect(template).not.toMatch(/.*Sales Channel 1 Id.*/)
    expect(template).not.toMatch(/.*Sales Channel 1 Name.*/)
    expect(template).not.toMatch(/.*Sales Channel 1 Description.*/)
    expect(template).not.toMatch(/.*Sales Channel 2 Id.*/)
    expect(template).not.toMatch(/.*Sales Channel 2 Name.*/)
    expect(template).not.toMatch(/.*Sales Channel 2 Description.*/)

    expect(template).toMatch(/.*Price USD.*/)
    expect(template).toMatch(/.*Price france \[USD\].*/)
    expect(template).toMatch(/.*Price denmark \[DKK\].*/)
    expect(template).toMatch(/.*Price Denmark \[DKK\].*/)

    expect(template).toMatch(/.*Image 1 Url.*/)
  })

  it("should process the batch job and generate the appropriate output", async () => {
    await productExportStrategy.prepareBatchJobForProcessing(
      fakeJob,
      {} as Request
    )
    await productExportStrategy.preProcessBatchJob(fakeJob.id)
    await productExportStrategy.processJob(fakeJob.id)
    expect(outputDataStorage).toMatchSnapshot()
    expect((fakeJob.result as any).file_key).toBeDefined()
  })

  it("should prepare the job to be pre processed", async () => {
    const fakeJob1: AdminPostBatchesReq = {
      type: "product-export",
      context: {
        limit: 10,
        offset: 10,
        expand: "variants",
        fields: "title",
        order: "-title",
        filterable_fields: { title: "test" },
      },
      dry_run: false,
    }

    const output1 = await productExportStrategy.prepareBatchJobForProcessing(
      fakeJob1,
      {} as Express.Request
    )

    expect(output1.context).toEqual(
      expect.objectContaining({
        list_config: {
          select: ["title", "created_at", "id"],
          order: { title: "DESC" },
          relations: ["variants"],
          skip: 10,
          take: 10,
        },
        filterable_fields: { title: "test" },
      })
    )

    const fakeJob2: AdminPostBatchesReq = {
      type: "product-export",
      context: {},
      dry_run: false,
    }

    const output2 = await productExportStrategy.prepareBatchJobForProcessing(
      fakeJob2,
      {} as Express.Request
    )

    expect(output2.context).toEqual(
      expect.objectContaining({
        list_config: {
          select: undefined,
          order: { created_at: "DESC" },
          relations: [
            ...defaultAdminProductRelations,
            "variants.prices.region",
          ],
          skip: 0,
          take: 50,
        },
        filterable_fields: undefined,
      })
    )
  })

  it("should always provide a file_key even with no data", async () => {
    const productExportStrategy = new ProductExportStrategy({
      batchJobService: batchJobServiceMock as any,
      fileService: fileServiceMock as any,
      productService: productServiceWithNoDataMock as any,
      manager: MockManager,
      featureFlagRouter: new FlagRouter({}),
    })

    await productExportStrategy.prepareBatchJobForProcessing(
      fakeJob,
      {} as Request
    )
    await productExportStrategy.preProcessBatchJob(fakeJob.id)
    await productExportStrategy.processJob(fakeJob.id)

    expect((fakeJob.result as any).file_key).toBeDefined()
  })

  it("should remove the file_key and file_size if the job is canceled", async () => {
    const productExportStrategy = new ProductExportStrategy({
      batchJobService: batchJobServiceMock as any,
      fileService: fileServiceMock as any,
      productService: productServiceMock as any,
      manager: MockManager,
      featureFlagRouter: new FlagRouter({}),
    })

    await productExportStrategy.prepareBatchJobForProcessing(
      canceledFakeJob,
      {} as Request
    )
    await productExportStrategy.preProcessBatchJob(canceledFakeJob.id)
    await productExportStrategy.processJob(canceledFakeJob.id)

    expect((canceledFakeJob.result as any).file_key).not.toBeDefined()
    expect((canceledFakeJob.result as any).file_size).not.toBeDefined()
  })
})

describe("Product export strategy with sales Channels", () => {
  const outputDataStorage: string[] = []
  const fileServiceMock = {
    delete: jest.fn(),
    getUploadStreamDescriptor: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        writeStream: {
          write: (data: string) => {
            outputDataStorage.push(data)
          },
          end: () => void 0,
        },
        promise: Promise.resolve(),
        fileKey: "product-export.csv",
      })
    }),
    withTransaction: function () {
      return this
    },
  }
  let fakeJob = {
    id: IdMap.getId("product-export-job"),
    type: "product-export",
    created_by: IdMap.getId("product-export-job-creator"),
    created_by_user: {} as User,
    context: {},
    result: {},
    dry_run: false,
    status: BatchJobStatus.PROCESSING as BatchJobStatus,
  } as ProductExportBatchJob

  let canceledFakeJob = {
    ...fakeJob,
    id: "bj_failed",
    status: BatchJobStatus.CANCELED,
  } as ProductExportBatchJob

  const batchJobServiceMock = {
    withTransaction: function () {
      return this
    },
    update: jest.fn().mockImplementation((jobOrId, data) => {
      if ((jobOrId?.id ?? jobOrId) === "bj_failed") {
        canceledFakeJob = {
          ...canceledFakeJob,
          ...data,
          context: { ...canceledFakeJob?.context, ...data?.context },
          result: { ...canceledFakeJob?.result, ...data?.result },
        }

        return Promise.resolve(canceledFakeJob)
      }

      fakeJob = {
        ...fakeJob,
        ...data,
        context: { ...fakeJob?.context, ...data?.context },
        result: { ...fakeJob?.result, ...data?.result },
      }

      return Promise.resolve(fakeJob)
    }),
    updateStatus: jest.fn().mockImplementation((status) => {
      fakeJob.status = status
      return Promise.resolve(fakeJob)
    }),
    complete: jest.fn().mockImplementation(() => {
      fakeJob.status = BatchJobStatus.COMPLETED
      return Promise.resolve(fakeJob)
    }),
    retrieve: jest.fn().mockImplementation((id) => {
      const targetFakeJob = id === "bj_failed" ? canceledFakeJob : fakeJob
      return Promise.resolve(targetFakeJob)
    }),
    setFailed: jest.fn().mockImplementation((...args) => {
      console.error(...args)
    }),
  }

  const productExportStrategy = new ProductExportStrategy({
    manager: managerMock,
    fileService: fileServiceMock as any,
    batchJobService: batchJobServiceMock as any,
    productService: productServiceMock as any,
    featureFlagRouter: new FlagRouter({
      [SalesChannelFeatureFlag.key]: true,
    }),
  })

  it("should generate the appropriate template", async () => {
    await productExportStrategy.prepareBatchJobForProcessing(
      fakeJob,
      {} as Request
    )
    await productExportStrategy.preProcessBatchJob(fakeJob.id)
    const template = await productExportStrategy.buildHeader(fakeJob)
    expect(template).toMatch(/.*Product Id.*/)
    expect(template).toMatch(/.*Product Handle.*/)
    expect(template).toMatch(/.*Product Title.*/)
    expect(template).toMatch(/.*Product Subtitle.*/)
    expect(template).toMatch(/.*Product Description.*/)
    expect(template).toMatch(/.*Product Status.*/)
    expect(template).toMatch(/.*Product Thumbnail.*/)
    expect(template).toMatch(/.*Product Weight.*/)
    expect(template).toMatch(/.*Product Length.*/)
    expect(template).toMatch(/.*Product Width.*/)
    expect(template).toMatch(/.*Product Height.*/)
    expect(template).toMatch(/.*Product HS Code.*/)
    expect(template).toMatch(/.*Product Origin Country.*/)
    expect(template).toMatch(/.*Product MID Code.*/)
    expect(template).toMatch(/.*Product Material.*/)
    expect(template).toMatch(/.*Product Collection Title.*/)
    expect(template).toMatch(/.*Product Collection Handle.*/)
    expect(template).toMatch(/.*Product Type.*/)
    expect(template).toMatch(/.*Product Tags.*/)
    expect(template).toMatch(/.*Product Discountable.*/)
    expect(template).toMatch(/.*Product External Id.*/)
    expect(template).toMatch(/.*Product Profile Name.*/)
    expect(template).toMatch(/.*Product Profile Type.*/)
    expect(template).toMatch(/.*Product Profile Type.*/)

    expect(template).toMatch(/.*Variant Id.*/)
    expect(template).toMatch(/.*Variant Title.*/)
    expect(template).toMatch(/.*Variant SKU.*/)
    expect(template).toMatch(/.*Variant Barcode.*/)
    expect(template).toMatch(/.*Variant Allow Backorder.*/)
    expect(template).toMatch(/.*Variant Manage Inventory.*/)
    expect(template).toMatch(/.*Variant Weight.*/)
    expect(template).toMatch(/.*Variant Length.*/)
    expect(template).toMatch(/.*Variant Width.*/)
    expect(template).toMatch(/.*Variant Height.*/)
    expect(template).toMatch(/.*Variant HS Code.*/)
    expect(template).toMatch(/.*Variant Origin Country.*/)
    expect(template).toMatch(/.*Variant MID Code.*/)
    expect(template).toMatch(/.*Variant Material.*/)

    expect(template).toMatch(/.*Option 1 Name.*/)
    expect(template).toMatch(/.*Option 1 Value.*/)
    expect(template).toMatch(/.*Option 2 Name.*/)
    expect(template).toMatch(/.*Option 2 Value.*/)

    expect(template).toMatch(/.*Price USD.*/)
    expect(template).toMatch(/.*Price france \[USD\].*/)
    expect(template).toMatch(/.*Price denmark \[DKK\].*/)
    expect(template).toMatch(/.*Price Denmark \[DKK\].*/)

    expect(template).toMatch(/.*Sales Channel 1 Id.*/)
    expect(template).toMatch(/.*Sales Channel 1 Name.*/)
    expect(template).toMatch(/.*Sales Channel 1 Description.*/)
    expect(template).toMatch(/.*Sales Channel 2 Id.*/)
    expect(template).toMatch(/.*Sales Channel 2 Name.*/)
    expect(template).toMatch(/.*Sales Channel 2 Description.*/)

    expect(template).toMatch(/.*Image 1 Url.*/)
  })

  it("should process the batch job and generate the appropriate output", async () => {
    await productExportStrategy.prepareBatchJobForProcessing(
      fakeJob,
      {} as Request
    )
    await productExportStrategy.preProcessBatchJob(fakeJob.id)
    await productExportStrategy.processJob(fakeJob.id)
    expect(outputDataStorage).toMatchSnapshot()
    expect((fakeJob.result as any).file_key).toBeDefined()
  })
})
