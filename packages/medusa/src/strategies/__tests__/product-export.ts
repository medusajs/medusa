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
    expect(template).toMatch(/.*Product Option Name \[1-1\].*/)
    expect(template).toMatch(/.*Product Option values \[1-1\].*/)
    expect(template).toMatch(/.*Variant Title \[1-2\].*/)
    expect(template).toMatch(/.*Variant SKU \[1-2\].*/)
    expect(template).toMatch(/.*Variant Barcode \[1-2\].*/)
    expect(template).toMatch(/.*Variant Allow backorder \[1-2\].*/)
    expect(template).toMatch(/.*Variant Manage inventory \[1-2\].*/)
    expect(template).toMatch(/.*Variant Option Value \[1-2\].*/)
    expect(template).toMatch(/.*Variant Weight \[1-2\].*/)
    expect(template).toMatch(/.*Variant Length \[1-2\].*/)
    expect(template).toMatch(/.*Variant Width \[1-2\].*/)
    expect(template).toMatch(/.*Variant Height \[1-2\].*/)
    expect(template).toMatch(/.*Variant HS Code \[1-2\].*/)
    expect(template).toMatch(/.*Variant Origin Country \[1-2\].*/)
    expect(template).toMatch(/.*Variant Mid Code \[1-2\].*/)
    expect(template).toMatch(/.*Variant Material \[1-2\].*/)
    expect(template).toMatch(/.*Variant Price Currency Code \[1-1\] \[1-2\].*/)
    expect(template).toMatch(/.*Variant Price Region Name \[1-1\] \[1-2\].*/)
    expect(template).toMatch(/.*Variant Price \[1-1\] \[1-2\].*/)
    expect(template).toMatch(/.*Variant Title \[2-2\].*/)
    expect(template).toMatch(/.*Variant SKU \[2-2\].*/)
    expect(template).toMatch(/.*Variant Barcode \[2-2\].*/)
    expect(template).toMatch(/.*Variant Allow backorder \[2-2\].*/)
    expect(template).toMatch(/.*Variant Manage inventory \[2-2\].*/)
    expect(template).toMatch(/.*Variant Option Value \[2-2\].*/)
    expect(template).toMatch(/.*Variant Weight \[2-2\].*/)
    expect(template).toMatch(/.*Variant Length \[2-2\].*/)
    expect(template).toMatch(/.*Variant Width \[2-2\].*/)
    expect(template).toMatch(/.*Variant Height \[2-2\].*/)
    expect(template).toMatch(/.*Variant HS Code \[2-2\].*/)
    expect(template).toMatch(/.*Variant Origin Country \[2-2\].*/)
    expect(template).toMatch(/.*Variant Mid Code \[2-2\].*/)
    expect(template).toMatch(/.*Variant Material \[2-2\].*/)
    expect(template).toMatch(/.*Variant Price Currency Code \[1-1\] \[2-2\].*/)
    expect(template).toMatch(/.*Variant Price Region Name \[1-1\] \[2-2\].*/)
    expect(template).toMatch(/.*Variant Price \[1-1\] \[2-2\].*/)
  })

  it('should process the batch job and generate the appropriate output', async () => {
    await productExportStrategy.processJob(fakeJob.id)
    expect(outputDataStorage).toMatchSnapshot()
  })
})
