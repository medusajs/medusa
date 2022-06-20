import OrderExportStrategy from "../batch/order/export"
import { IdMap, MockManager } from "medusa-test-utils"
import { User } from "../../models"
import { BatchJobStatus } from "../../types/batch-job"
import { ordersToExport } from "../__fixtures__/order-export-data"

const outputDataStorage: string[] = []

let fakeJob = {
  id: IdMap.getId("order-export-job"),
  type: "order-export",
  context: {
    params: {},
    list_config: {
      select: [
        "id",
        "display_id",
        "status",
        "created_at",
        "fulfillment_status",
        "payment_status",
        "subtotal",
        "shipping_total",
        "discount_total",
        "gift_card_total",
        "refunded_total",
        "tax_total",
        "total",
        "currency_code",
        "region_id",
      ],
      relations: ["customer", "shipping_address"],
    },
  },
  created_by: IdMap.getId("order-export-job-creator"),
  created_by_user: {} as User,
  result: {},
  dry_run: false,
  status: BatchJobStatus.PROCESSING,
}

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
}
const batchJobServiceMock = {
  withTransaction: function (): any {
    return this
  },
  update: jest.fn().mockImplementation(async (data) => {
    fakeJob = {
      ...fakeJob,
      ...data,
    }
    return fakeJob
  }),
  complete: jest.fn().mockImplementation(async () => {
    fakeJob.status = BatchJobStatus.COMPLETED
    return fakeJob
  }),
  ready: jest.fn().mockImplementation(async () => {
    fakeJob.status = BatchJobStatus.READY
    return fakeJob
  }),
  retrieve: jest.fn().mockImplementation(async () => {
    return fakeJob
  }),
}
const orderServiceMock = {
  withTransaction: function (): any {
    return this
  },
  listAndCount: jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve([ordersToExport, ordersToExport.length])
    ),
  list: jest.fn().mockImplementation(() => Promise.resolve(ordersToExport)),
}

describe("Order export strategy", () => {
  const orderExportStrategy = new OrderExportStrategy({
    batchJobService: batchJobServiceMock as any,
    fileService: fileServiceMock as any,
    orderService: orderServiceMock as any,
    manager: MockManager,
  })

  it("Should generate header as template", async () => {
    const template = await orderExportStrategy.buildTemplate()
    expect(template.split(";")).toEqual([
      "Order_ID",
      "Display_ID",
      "Order status",
      "Date",
      "Customer First name",
      "Customer Last name",
      "Customer Email",
      "Customer ID",
      "Shipping Address 1",
      "Shipping Address 2",
      "Shipping Country Code",
      "Shipping City",
      "Shipping Postal Code",
      "Shipping Region ID",
      "Fulfillment Status",
      "Payment Status",
      "Subtotal",
      "Shipping Total",
      "Discount Total",
      "Gift Card Total",
      "Refunded Total",
      "Tax Total",
      "Total",
      "Currency Code\r\n",
    ])
  })

  it("should process the batch job and generate the appropriate output", async () => {
    await orderExportStrategy.processJob(fakeJob.id)

    expect(outputDataStorage).toMatchSnapshot()
  })
})
