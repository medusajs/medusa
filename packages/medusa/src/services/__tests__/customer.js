import mongoose from "mongoose"
import { IdMap } from "medusa-test-utils"
import CustomerService from "../customer"
import { CustomerModelMock, customers } from "../../models/__mocks__/customer"

describe("CustomerService", () => {
  describe("retrieve", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const customerService = new CustomerService({
        customerModel: CustomerModelMock,
      })
      result = await customerService.retrieve(IdMap.getId("testCustomer"))
    })

    it("calls customer model functions", () => {
      expect(CustomerModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(CustomerModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("testCustomer"),
      })
    })

    it("returns the customer", () => {
      expect(result).toEqual(customers.testCustomer)
    })
  })

  describe("setMetadata", () => {
    const customerService = new CustomerService({
      customerModel: CustomerModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = mongoose.Types.ObjectId()
      await customerService.setMetadata(`${id}`, "metadata", "testMetadata")

      expect(CustomerModelMock.updateOne).toBeCalledTimes(1)
      expect(CustomerModelMock.updateOne).toBeCalledWith(
        { _id: `${id}` },
        { $set: { "metadata.metadata": "testMetadata" } }
      )
    })

    it("throw error on invalid key type", async () => {
      const id = mongoose.Types.ObjectId()

      try {
        await customerService.setMetadata(`${id}`, 1234, "nono")
      } catch (err) {
        expect(err.message).toEqual(
          "Key type is invalid. Metadata keys must be strings"
        )
      }
    })
  })
})
