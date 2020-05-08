import { IdMap } from "medusa-test-utils"
import jwt from "jsonwebtoken"
import { request } from "../../../../../helpers/test-request"
import { CustomerServiceMock } from "../../../../../services/__mocks__/customer"

describe("POST /store/customers/password-token", () => {
  describe("successfully creates a customer", () => {
    let subject
    beforeAll(async () => {
      subject = await request("POST", `/store/customers/password-token`, {
        payload: {
          email: "lebron@james.com",
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CustomerService retrieve", () => {
      expect(CustomerServiceMock.retrieveByEmail).toHaveBeenCalledTimes(1)
      expect(CustomerServiceMock.retrieveByEmail).toHaveBeenCalledWith(
        "lebron@james.com"
      )
    })

    it("calls CustomerService retrieve", () => {
      expect(
        CustomerServiceMock.generateResetPasswordToken
      ).toHaveBeenCalledTimes(1)
      expect(
        CustomerServiceMock.generateResetPasswordToken
      ).toHaveBeenCalledWith(IdMap.getId("lebron"))
    })

    it("returns customer decorated", () => {
      expect(subject.status).toEqual(204)
    })
  })
})
