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
  yield "Product Title;Product Handle;Product Description\n"
  yield "Prod title 1;prod-handle;Very loong desc text\n"
  yield "Prod 2;prod-handle-2;Another loong desc text\n"
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
  const productImportStrategy = new ProductImportStrategy({
    manager: managerMock,
    fileService: fileServiceMock as any,
    batchJobService: batchJobServiceMock as any,
    productService: productServiceMock as any,
    productRepository: productRepositoryMock,
    productVariantService: productVariantServiceMock,
    productVariantRepository: productVariantRepositoryMock,
    redisClient: new FakeRedis(),
  })

  it("`prepareBatchJobForProcessing` should parse CSV from context", async () => {
    await productImportStrategy.prepareBatchJobForProcessing(fakeJob.id, {})

    expect(batchJobServiceMock.ready).toBeCalled()
  })
})
