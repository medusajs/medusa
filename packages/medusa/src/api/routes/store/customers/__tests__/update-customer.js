import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CustomerServiceMock } from "../../../../../services/__mocks__/customer"

describe("POST /store/customers/:id", () => {
  describe("successfully updates a customer", () => {
    let subject
    beforeAll(async () => {
      subject = await request(
        "POST",
        `/store/customers/${IdMap.getId("lebron")}`,
        {
          payload: {
            first_name: "LeBron",
            last_name: "James",
          },
          clientSession: {
            jwt: {
              customer_id: IdMap.getId("lebron"),
            },
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CustomerService create", () => {
      expect(CustomerServiceMock.update).toHaveBeenCalledTimes(1)
      expect(CustomerServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("lebron"),
        {
          first_name: "LeBron",
          last_name: "James",
        }
      )
    })

    it("returns product decorated", () => {
      expect(subject.body.first_name).toEqual("LeBron")
      expect(subject.body.decorated).toEqual(true)
    })
  })

  describe("fails if not authenticated", () => {
    let subject
    beforeAll(async () => {
      subject = await request(
        "POST",
        `/store/customers/${IdMap.getId("customer1")}`,
        {
          payload: {
            first_name: "LeBron",
            last_name: "James",
          },
          clientSession: {
            jwt: {
              customer_id: IdMap.getId("lebron"),
            },
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("status code 400", () => {
      expect(subject.status).toEqual(400)
    })
  })
})
