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

  describe("retrieveByEmail", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const customerService = new CustomerService({
        customerModel: CustomerModelMock,
      })
      result = await customerService.retrieveByEmail("oliver@medusa.com")
    })

    it("calls customer model functions", () => {
      expect(CustomerModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(CustomerModelMock.findOne).toHaveBeenCalledWith({
        email: "oliver@medusa.com",
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

  describe("create", () => {
    const customerService = new CustomerService({
      customerModel: CustomerModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls model layer create", async () => {
      await customerService.create({
        email: "oliver@medusa.com",
        first_name: "Oliver",
        last_name: "Juhl",
      })

      expect(CustomerModelMock.create).toBeCalledTimes(1)
      expect(CustomerModelMock.create).toBeCalledWith({
        email: "oliver@medusa.com",
        first_name: "Oliver",
        last_name: "Juhl",
      })
    })

    it("calls model layer create", async () => {
      await customerService.create({
        email: "new@medusa.com",
        first_name: "Oliver",
        last_name: "Juhl",
        password: "secretsauce",
      })

      expect(CustomerModelMock.create).toBeCalledTimes(1)
      expect(CustomerModelMock.create).toBeCalledWith({
        email: "new@medusa.com",
        first_name: "Oliver",
        last_name: "Juhl",
        has_account: true,
        password_hash: expect.stringMatching(
          /^\$2[aby]?\$[\d]+\$[./A-Za-z0-9]{53}$/
        ),
      })
    })

    it("fails if email is in incorrect format", async () => {
      expect(
        customerService.create({
          email: "olivermedusa.com",
          first_name: "Oliver",
          last_name: "Juhl",
        })
      ).rejects.toThrow("The email is not valid")
    })

    it("fails if billing address is in incorrect format", () => {
      expect(
        customerService.create({
          email: "oliver@medusa.com",
          first_name: "Oliver",
          last_name: "Juhl",
          billing_address: {
            first_name: 1234,
          },
        })
      ).rejects.toThrow("The address is not valid")
    })
  })

  describe("update", () => {
    const customerService = new CustomerService({
      customerModel: CustomerModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully updates a customer", async () => {
      await customerService.update(IdMap.getId("testCustomer"), {
        first_name: "Olli",
        last_name: "Test",
        email: "oliver@medusa2.com",
      })

      expect(CustomerModelMock.updateOne).toBeCalledTimes(1)
      expect(CustomerModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("testCustomer") },
        {
          $set: {
            first_name: "Olli",
            last_name: "Test",
            email: "oliver@medusa2.com",
          },
        },
        { runValidators: true }
      )
    })

    it("fails if metadata updates are attempted", async () => {
      try {
        await customerService.update(IdMap.getId("testCustomer"), {
          metadata: "Nononono",
        })
      } catch (err) {
        expect(err.message).toEqual("Use setMetadata to update metadata fields")
      }
    })

    it("updates with billing address", async () => {
      await customerService.update(IdMap.getId("testCustomer"), {
        first_name: "Olli",
        last_name: "Test",
        billing_address: {
          first_name: "Olli",
          last_name: "Juhl",
          address_1: "Laksegade",
          city: "Copenhagen",
          country_code: "DK",
          postal_code: "2100",
          phone: "+1 (222) 333 4444",
        },
      })

      expect(CustomerModelMock.updateOne).toBeCalledTimes(1)
      expect(CustomerModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("testCustomer") },
        {
          $set: {
            first_name: "Olli",
            last_name: "Test",
            billing_address: {
              first_name: "Olli",
              last_name: "Juhl",
              address_1: "Laksegade",
              city: "Copenhagen",
              country_code: "DK",
              postal_code: "2100",
              phone: "+1 (222) 333 4444",
            },
          },
        },
        { runValidators: true }
      )
    })

    it("updates with password", async () => {
      await customerService.update(IdMap.getId("testCustomer"), {
        password: "newpassword",
      })

      expect(CustomerModelMock.updateOne).toBeCalledTimes(1)
      expect(CustomerModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("testCustomer") },
        {
          $set: {
            has_account: true,
            password_hash: expect.stringMatching(
              /^\$2[aby]?\$[\d]+\$[./A-Za-z0-9]{53}$/
            ),
          },
        },
        { runValidators: true }
      )
    })
  })

  describe("delete", () => {
    const customerService = new CustomerService({
      customerModel: CustomerModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("deletes customer successfully", async () => {
      await customerService.delete(IdMap.getId("deleteId"))

      expect(CustomerModelMock.deleteOne).toBeCalledTimes(1)
      expect(CustomerModelMock.deleteOne).toBeCalledWith({
        _id: IdMap.getId("deleteId"),
      })
    })
  })
})
