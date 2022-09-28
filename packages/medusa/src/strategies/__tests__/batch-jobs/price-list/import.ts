import { Readable, PassThrough } from "stream"
import { EntityManager } from "typeorm"

import { FileService } from "medusa-interfaces"
import { MockManager } from "medusa-test-utils"

import { User } from "../../../../models"
import { BatchJobStatus } from "../../../../types/batch-job"
import PriceListImportStrategy from "../../../batch-jobs/price-list/import"
import {
  PriceListService,
  BatchJobService,
  ProductVariantService,
  RegionService,
} from "../../../../services"
import { InjectedProps } from "../../../batch-jobs/price-list/types"

let fakeJob = {
  id: "batch_plimport",
  type: "price-list-import",
  context: {
    price_list_id: "pl_1234",
    fileKey: "csv.key",
  },
  results: { advancement_count: 0, count: 6 },
  created_by: "usr_tester",
  created_by_user: {} as User,
  result: {},
  dry_run: false,
  status: BatchJobStatus.PROCESSING,
}

async function* generateCSVDataForStream() {
  yield "Product Variant ID,SKU,Price EUR,Price NA [USD]\n"
  yield ",MEDUSA-SWEAT-SMALL,15,13.5\n"
  yield "5VxiEkmnPV,,15,13.5\n"
}

/* ******************** SERVICES MOCK ******************** */

const fileServiceMock = {
  withTransaction: function () {
    return this
  },
  delete: jest.fn(),
  getDownloadStream: jest.fn().mockImplementation(() => {
    return Promise.resolve(Readable.from(generateCSVDataForStream()))
  }),
  getUploadStreamDescriptor: jest.fn().mockImplementation(() => ({
    writeStream: new PassThrough(),
    promise: Promise.resolve(),
  })),
}

const priceListServiceMock = {
  withTransaction: function () {
    return this
  },
  retrieve: jest.fn().mockImplementation(() => {
    return Promise.resolve(fakeJob)
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
  confirmed: jest.fn().mockImplementation(() => {
    fakeJob.status = BatchJobStatus.CONFIRMED
    return Promise.resolve(fakeJob)
  }),
  retrieve: jest.fn().mockImplementation(() => {
    return Promise.resolve(fakeJob)
  }),
}

const productVariantServiceMock = {
  withTransaction: function () {
    return this
  },
  retrieve: jest.fn().mockImplementation(() =>
    Promise.resolve({
      id: "retrieved-by-id",
    })
  ),
  retrieveBySKU: jest.fn().mockImplementation(() =>
    Promise.resolve({
      id: "retrieved-by-sku",
    })
  ),
}

const regionServiceMock = {
  withTransaction: function () {
    return this
  },
  retrieveByName: jest.fn().mockImplementation(() =>
    Promise.resolve({
      id: "reg_HMnixPlOicAs7aBlXuchAGxd",
      name: "Denmark",
      currency_code: "DKK",
      currency: "DKK",
      tax_rate: 0.25,
      tax_code: null,
      countries: [
        {
          id: "1001",
          iso_2: "DK",
          iso_3: "DNK",
          num_code: "208",
          name: "denmark",
          display_name: "Denmark",
        },
      ],
    })
  ),
}

const managerMock = MockManager

/* ******************** PRICE LIST IMPORT STRATEGY TESTS ******************** */

describe("Price List import strategy", () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  const priceListImportStrategy = new PriceListImportStrategy({
    manager: managerMock as EntityManager,
    fileService: fileServiceMock as typeof FileService,
    batchJobService: batchJobServiceMock as unknown as BatchJobService,
    priceListService: priceListServiceMock as unknown as PriceListService,
    productVariantService:
      productVariantServiceMock as unknown as ProductVariantService,
    regionService: regionServiceMock as unknown as RegionService,
  } as unknown as InjectedProps)

  it("`preProcessBatchJob` should generate import ops and upload them to a bucket using the file service", async () => {
    const getImportInstructionsSpy = jest.spyOn(
      priceListImportStrategy,
      "getImportInstructions"
    )

    await priceListImportStrategy.preProcessBatchJob(fakeJob.id)

    expect(getImportInstructionsSpy).toBeCalledTimes(1)
    expect(fileServiceMock.getUploadStreamDescriptor).toBeCalledTimes(1)
    expect(fileServiceMock.getUploadStreamDescriptor).toHaveBeenCalledWith({
      ext: "json",
      name: `imports/price-lists/ops/${fakeJob.id}-PRICE_LIST_PRICE_CREATE`,
    })

    getImportInstructionsSpy.mockRestore()
  })
})
