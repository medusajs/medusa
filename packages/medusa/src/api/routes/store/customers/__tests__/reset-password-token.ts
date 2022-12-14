import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CustomerServiceMock } from "../../../../../services/__mocks__/customer"

describe("POST /store/customers/password-token", () => {
  describe("successfully creates a customer", () => {
    let subject
    beforeAll(async () => {
      subject = await request("POST", `/store/customers/password-token`, {
        payload: {
          email: "lebron@james1.com",
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CustomerService retrieve", () => {
      expect(
        CustomerServiceMock.retrieveRegisteredByEmail
      ).toHaveBeenCalledTimes(1)
      expect(
        CustomerServiceMock.retrieveRegisteredByEmail
      ).toHaveBeenCalledWith("lebron@james1.com")
    })

    it("calls CustomerService retrieve", () => {
      expect(
        CustomerServiceMock.generateResetPasswordToken
      ).toHaveBeenCalledTimes(1)
      expect(
        CustomerServiceMock.generateResetPasswordToken
      ).toHaveBeenCalledWith(IdMap.getId("lebron"))
    })

    it("returns success", () => {
      expect(subject.status).toEqual(204)
    })
  })
})
