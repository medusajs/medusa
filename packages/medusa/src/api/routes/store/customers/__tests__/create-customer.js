import { IdMap } from "medusa-test-utils"
import {
  defaultStoreCustomersFields,
  defaultStoreCustomersRelations,
} from "../"
import { request } from "../../../../../helpers/test-request"
import { CustomerServiceMock } from "../../../../../services/__mocks__/customer"

describe("POST /store/customers", () => {
  describe("successfully creates a customer", () => {
    let subject
    beforeAll(async () => {
      subject = await request("POST", `/store/customers`, {
        payload: {
          email: "lebron@james.com",
          first_name: "LeBron",
          last_name: "James",
          password: "TheGame",
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CustomerService create", () => {
      expect(CustomerServiceMock.create).toHaveBeenCalledTimes(1)
      expect(CustomerServiceMock.create).toHaveBeenCalledWith({
        email: "lebron@james.com",
        first_name: "LeBron",
        last_name: "James",
        password: "TheGame",
      })
    })

    it("calls CustomerService retrieve", () => {
      expect(CustomerServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(CustomerServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("lebron"),
        {
          relations: defaultStoreCustomersRelations,
          select: defaultStoreCustomersFields,
        }
      )
    })

    it("returns customer", () => {
      expect(subject.body.customer.email).toEqual("lebron@james.com")
    })
  })

  describe("fails if missing field", () => {
    let subject
    beforeAll(async () => {
      subject = await request("POST", `/store/customers`, {
        payload: {
          first_name: "LeBron",
          last_name: "James",
          password: "TheGame",
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("returns product decorated", () => {
      expect(subject.body.type).toEqual("invalid_data")
    })
  })
})
