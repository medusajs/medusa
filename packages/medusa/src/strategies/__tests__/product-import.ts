import { IdMap, MockManager, MockRepository } from "medusa-test-utils"

import { User } from "../../models"
import { BatchJobStatus } from "../../types/batch-job"
import ProductImportStrategy from "../product-import"

const outputDataStorage: string[] = []

let fakeJob = {
  id: IdMap.getId("product-import-job"),
  type: "product-import",
  context: {},
  created_by: IdMap.getId("product-import-creator"),
  created_by_user: {} as User,
  result: {},
  dry_run: false,
  status: BatchJobStatus.PROCESSING,
}

/* ******************** SERVICES MOCK ******************** */

const fileServiceMock = {
  delete: jest.fn(),
  getDownloadStream: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      writeStream: {
        write: (data: string) => {
          outputDataStorage.push(data)
        },
        end: () => void 0,
      },
      promise: Promise.resolve(),
    })
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

const managerMock = MockManager

const productRepositoryMock = {
  ...MockRepository(),
  save: () => {},
}

/* ******************** PRODUCT IMPORT STRATEGY TESTS ******************** */

describe("Product export strategy", () => {
  const productImportStrategy = new ProductImportStrategy({
    manager: managerMock,
    fileService: fileServiceMock as any,
    batchJobService: batchJobServiceMock as any,
    productService: productServiceMock as any,
    productRepository: productRepositoryMock,
  })

  it("should TODO", async () => {})
})
