import ProductExportStrategy from "../../../batch-jobs/product/export"
import { IdMap, MockManager } from "medusa-test-utils"
import { User } from "../../../../models"
import { BatchJobStatus } from "../../../../types/batch-job"
import { productsToExport } from "../../../__fixtures__/product-export-data"
import { AdminPostBatchesReq } from "../../../../api/routes/admin/batch/create-batch-job"
import { defaultAdminProductRelations } from "../../../../api/routes/admin/products"
import { ProductExportBatchJob } from "../../../batch-jobs/product"
import { Request } from "express"

const outputDataStorage: string[] = []

let fakeJob = {
  id: IdMap.getId("product-export-job"),
  type: 'product-export',
  created_by: IdMap.getId("product-export-job-creator"),
  created_by_user: {} as User,
  context: {},
  result: {},
  dry_run: false,
  status: BatchJobStatus.PROCESSING as BatchJobStatus
} as ProductExportBatchJob

const fileServiceMock = {
  delete: jest.fn(),
  getUploadStreamDescriptor: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      writeStream: {
        write: (data: string) => {
          outputDataStorage.push(data)
        },
        end: () => void 0
      },
      promise: Promise.resolve(),
      url: 'product-export.csv'
    })
  }),
  withTransaction: function () {
    return this
  }
}
const batchJobServiceMock = {
  withTransaction: function () {
    return this
  },
  update: jest.fn().mockImplementation((job, data) => {
    fakeJob = {
      ...fakeJob,
      ...data,
      context: { ...fakeJob?.context, ...data?.context },
      result: { ...fakeJob?.result, ...data?.result }
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
  retrieve: jest.fn().mockImplementation(() => {
    return Promise.resolve(fakeJob)
  }),
  setFailed: jest.fn().mockImplementation((...args) => {
    console.error(...args)
  })
}
const productServiceMock = {
  withTransaction: function () {
    return this
  },
  list: jest.fn().mockImplementation(() => Promise.resolve(productsToExport)),
  count: jest.fn().mockImplementation(() => Promise.resolve(productsToExport.length)),
  listAndCount: jest.fn().mockImplementation(() => {
    return Promise.resolve([productsToExport, productsToExport.length])
  }),
}
const managerMock = MockManager

describe("Product export strategy", () => {
  const productExportStrategy = new ProductExportStrategy({
    manager: managerMock,
    fileService: fileServiceMock as any,
    batchJobService: batchJobServiceMock as any,
    productService: productServiceMock as any,
  })

  it('should generate the appropriate template', async () => {
    await productExportStrategy.prepareBatchJobForProcessing(fakeJob, {} as Request)
    await productExportStrategy.preProcessBatchJob(fakeJob.id)
    const template = await productExportStrategy.buildHeader(fakeJob)
    expect(template).toMatch(/.*Product ID.*/)
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
    expect(template).toMatch(/.*Product External ID.*/)
    expect(template).toMatch(/.*Product Profile Name.*/)
    expect(template).toMatch(/.*Product Profile Type.*/)
    expect(template).toMatch(/.*Product Profile Type.*/)

    expect(template).toMatch(/.*Variant ID.*/)
    expect(template).toMatch(/.*Variant Title.*/)
    expect(template).toMatch(/.*Variant SKU.*/)
    expect(template).toMatch(/.*Variant Barcode.*/)
    expect(template).toMatch(/.*Variant Allow backorder.*/)
    expect(template).toMatch(/.*Variant Manage inventory.*/)
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

    expect(template).toMatch(/.*Image 1 Url.*/)
  })

  it('should process the batch job and generate the appropriate output', async () => {
    await productExportStrategy.prepareBatchJobForProcessing(fakeJob, {} as Request)
    await productExportStrategy.preProcessBatchJob(fakeJob.id)
    await productExportStrategy.processJob(fakeJob.id)
    expect(outputDataStorage).toMatchSnapshot()
  })

  it('should prepare the job to be pre proccessed', async () => {
    const fakeJob1: AdminPostBatchesReq = {
      type: 'product-export',
      context: {
        limit: 10,
        offset: 10,
        expand: "variants",
        fields: "title",
        order: "-title",
        filterable_fields: { title: "test" }
      },
      dry_run: false
    }

    const output1 = await productExportStrategy.prepareBatchJobForProcessing(
      fakeJob1,
      {} as Express.Request
    )

    expect(output1.context).toEqual(expect.objectContaining({
      list_config: {
        select: ["title", "created_at", "id"],
        order: { title: "DESC" },
        relations: ["variants"],
        skip: 10,
        take: 10,
      },
      filterable_fields: { title: "test" }
    }))

    const fakeJob2: AdminPostBatchesReq = {
      type: 'product-export',
      context: {},
      dry_run: false
    }

    const output2 = await productExportStrategy.prepareBatchJobForProcessing(
      fakeJob2,
      {} as Express.Request
    )

    expect(output2.context).toEqual(expect.objectContaining({
      list_config: {
        select: undefined,
        order: { created_at: "DESC" },
        relations: [
          ...defaultAdminProductRelations,
          "variants.prices.region"
        ],
        skip: 0,
        take: 50,
      },
      filterable_fields: undefined
    }))
  })
})
