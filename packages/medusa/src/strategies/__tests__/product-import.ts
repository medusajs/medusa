import { Readable } from "stream"
import FakeRedis from "ioredis-mock"

import { IdMap, MockManager, MockRepository } from "medusa-test-utils"

import { User } from "../../models"
import { BatchJobStatus } from "../../types/batch-job"
import ProductImportStrategy from "../product-import"

let fakeJob = {
  id: IdMap.getId("product-import-job"),
  type: "product-import",
  context: {
    progress: undefined,
    csvFileKey: "csv.key",
  },
  created_by: IdMap.getId("product-import-creator"),
  created_by_user: {} as User,
  result: {},
  dry_run: false,
  status: BatchJobStatus.PROCESSING,
}

async function* generateCSVDataForStream() {
  yield "Product Handle;Product Title;Product Subtitle;Product Description;Product Status;Product Thumbnail;Product Weight;Product Length;Product Width;Product Height;Product HS Code;Product Origin Country;Product Mid Code;Product Material;Product Collection Title;Product Collection Handle;Product Type;Product Tags;Product Discountable;Product External ID;Product Profile Name;Product Profile Type;Variant Title;Variant SKU;Variant Barcode;Variant Inventory Quantity;Variant Allow backorder;Variant Manage inventory;Variant Weight;Variant Length;Variant Width;Variant Height;Variant HS Code;Variant Origin Country;Variant Mid Code;Variant Material;Option 1 Name;Option 1 Value;Option 2 Name;Option 2 Value;Price 1 Currency code;Price 1 Region name;Price 1 Amount;Image 1 Url\n"
  yield "test-product-product-1;Test product;;test-product-description-1;draft;;;;;;;;;;Test collection 1;test-collection1;test-type-1;123_1;true;;profile_1;profile_type_1;;;;;;;;;;;;;;;test-option-1;;test-option-2;;;;;test-image.png\n"
  yield "test-product-product-1;;;;;;;;;;;;;;;;;;;;;;Test variant;test-sku;test-barcode;10;false;true;;;;;;;;;;option 1 value 1;;option 2 value 1;usd;;100;\n"
  yield "test-product-product-2;Test product;;test-product-description;draft;;;;;;;;;;Test collection;test-collection2;test-type;123;true;;profile_2;profile_type_2;;;;;;;;;;;;;;;test-option;;;;;;;test-image.png\n"
  yield "test-product-product-2;;;;;;;;;;;;;;;;;;;;;;Test variant;test-sku;test-barcode;10;false;true;;;;;;;;;;Option 1 value 1;;;usd;;100;\n"
  yield "test-product-product-2;;;;;;;;;;;;;;;;;;;;;;Test variant;test-sku;test-barcode;10;false;true;;;;;;;;;;Option 1 Value 1;;;usd;;100;\n"
}

/* ******************** SERVICES MOCK ******************** */

const fileServiceMock = {
  delete: jest.fn(),
  getDownloadStream: jest.fn().mockImplementation(() => {
    return Promise.resolve(Readable.from(generateCSVDataForStream()))
  }),
}

const batchJobServiceMock = {
  withTransaction: function () {
    return this
  },
  update: jest.fn().mockImplementation((data) => {
    fakeJob = {
      ...fakeJob,
      ...data,
    }
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
  }),
}

const productServiceMock = {
  withTransaction: function () {
    return this
  },
  count: jest.fn().mockImplementation(() => Promise.resolve()),
}

const productVariantServiceMock = {
  withTransaction: function () {
    return this
  },
  count: jest.fn().mockImplementation(() => Promise.resolve()),
}

/* ******************** REPOSITORY MOCK ******************** */

const managerMock = MockManager

const productRepositoryMock = {
  ...MockRepository(),
  save: () => {},
}

const productVariantRepositoryMock = {
  ...MockRepository(),
  save: () => {},
}

/* ******************** PRODUCT IMPORT STRATEGY TESTS ******************** */

describe("Product import strategy", () => {
  const redisClient = new FakeRedis()

  beforeAll(() => {
    redisClient.client.call = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
  })

  const productImportStrategy = new ProductImportStrategy({
    manager: managerMock,
    fileService: fileServiceMock as any,
    batchJobService: batchJobServiceMock as any,
    productService: productServiceMock as any,
    productRepository: productRepositoryMock,
    productVariantService: productVariantServiceMock,
    productVariantRepository: productVariantRepositoryMock,
    redisClient,
  })

  it("`prepareBatchJobForProcessing` should parse CSV from context", async () => {
    await productImportStrategy.prepareBatchJobForProcessing(fakeJob.id, {})

    expect(redisClient.client.call).toBeCalledTimes(4)

    // expect(redisClient.client.call).toBeCalledWith(
    //   "JSON.SET",
    //   `pij_${fakeJob.id}`,
    //   "TODO"
    // )

    expect(batchJobServiceMock.ready).toBeCalled()
  })
})
