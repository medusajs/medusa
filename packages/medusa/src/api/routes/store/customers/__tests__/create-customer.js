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

    it("returns customer decorated", () => {
      expect(subject.body.customer.email).toEqual("lebron@james.com")
      expect(subject.body.customer.decorated).toEqual(true)
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
      expect(subject.body.name).toEqual("invalid_data")
    })
  })
})
