import ProductExportStrategy from "../product-export"
import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import { User } from "../../models"
import { BatchJobStatus } from "../../types/batch-job"
import { productsToExport } from "../__fixtures__/product-export-data"

const outputDataStorage: string[] = []

let fakeJob = {
  id: IdMap.getId("product-export-job"),
  type: 'product-export',
  context: {
    listConfig: {},
    filterableFields: {},
  },
  created_by: IdMap.getId("product-export-job-creator"),
  created_by_user: {} as User,
  result: {},
  dry_run: false,
  status: BatchJobStatus.PROCESSING
}

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
  })
}
const batchJobServiceMock = {
  withTransaction: function () {
    return this
  },
  update: jest.fn().mockImplementation(data => {
    fakeJob = {
      ...fakeJob,
      ...data
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
  ready: jest.fn().mockImplementation(() => {
    fakeJob.status = BatchJobStatus.READY
    return Promise.resolve(fakeJob)
  }),
  retrieve: jest.fn().mockImplementation(() => {
    return Promise.resolve(fakeJob)
  })
}
const productServiceMock = {
  withTransaction: function () {
    return this
  },
  list: jest.fn().mockImplementation(() => Promise.resolve(productsToExport)),
  count: jest.fn().mockImplementation(() => Promise.resolve(productsToExport.length)),
  listAndCount: jest.fn().mockImplementation(() => Promise.resolve([productsToExport, productsToExport.length])),
}
const managerMock = MockManager
const productRepositoryMock = {
  ...MockRepository(),
  query: jest.fn().mockImplementation(() => {
    return Promise.resolve([{
      maxOptionsCount: Math.max(...productsToExport.map(p => p.options.length)),
      maxImagesCount: Math.max(...productsToExport.map(p => p.images.length)),
      maxVariantsCount: Math.max(...productsToExport.map(p => p.variants.length)),
      maxMoneyAmountCount: Math.max(...productsToExport.map(p => p.variants.map(v => v.prices.length)).flat()),
    }])
  })
}

describe("Product export strategy", () => {
  const productExportStrategy = new ProductExportStrategy({
    manager: managerMock,
    fileService: fileServiceMock as any,
    batchJobService: batchJobServiceMock as any,
    productService: productServiceMock as any,
    productRepository: productRepositoryMock
  })

  it('should generate the appropriate template', async () => {
    const template = await productExportStrategy.buildTemplate()
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
    expect(template).toMatch(/.*Product Mid Code.*/)
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
    expect(template).toMatch(/.*Variant Mid Code.*/)
    expect(template).toMatch(/.*Variant Material.*/)

    expect(template).toMatch(/.*Option 1 Name.*/)
    expect(template).toMatch(/.*Option 1 Value.*/)
    expect(template).toMatch(/.*Option 2 Name.*/)
    expect(template).toMatch(/.*Option 2 Value.*/)

    expect(template).toMatch(/.*Price 1 Currency code.*/)
    expect(template).toMatch(/.*Price 1 Region name.*/)
    expect(template).toMatch(/.*Price 1 Amount.*/)

    expect(template).toMatch(/.*Image 1 Url.*/)
  })

  it('should process the batch job and generate the appropriate output', async () => {
    await productExportStrategy.processJob(fakeJob.id)
    expect(outputDataStorage).toMatchSnapshot()
  })
})
