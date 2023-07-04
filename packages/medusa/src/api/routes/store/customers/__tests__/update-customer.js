import { IdMap } from "medusa-test-utils"
import {
  defaultStoreCustomersFields,
  defaultStoreCustomersRelations,
} from "../"
import { request } from "../../../../../helpers/test-request"
import { CustomerServiceMock } from "../../../../../services/__mocks__/customer"

describe("POST /store/customers/me", () => {
  describe("successfully updates a customer", () => {
    let subject
    beforeAll(async () => {
      subject = await request("POST", `/store/customers/me`, {
        payload: {
          first_name: "LeBron",
          last_name: "James",
          email: "test@email.com",
        },
        clientSession: {
          jwt: {
            customer_id: IdMap.getId("lebron"),
          },
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CustomerService update", () => {
      expect(CustomerServiceMock.update).toHaveBeenCalledTimes(1)
      expect(CustomerServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("lebron"),
        {
          first_name: "LeBron",
          last_name: "James",
          email: "test@email.com",
        }
      )
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
      expect(subject.body.customer.id).toEqual(IdMap.getId("lebron"))
    })

    it("status code 200", () => {
      expect(subject.status).toEqual(200)
    })
  })

  describe("fails update a customer with a billing address with an invalid type", () => {
    let subject
    beforeAll(async () => {
      subject = await request("POST", `/store/customers/me`, {
        payload: {
          billing_address: 42,
        },
        clientSession: {
          jwt: {
            customer_id: IdMap.getId("lebron"),
          },
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CustomerService update 0 times", () => {
      expect(CustomerServiceMock.update).toHaveBeenCalledTimes(0)
    })

    it("status code 400", () => {
      expect(subject.status).toEqual(400)
    })
  })

  describe("successfully updates a customer with billing address id", () => {
    let subject
    beforeAll(async () => {
      subject = await request("POST", `/store/customers/me`, {
        payload: {
          billing_address: "test",
        },
        clientSession: {
          jwt: {
            customer_id: IdMap.getId("lebron"),
          },
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CustomerService update", () => {
      expect(CustomerServiceMock.update).toHaveBeenCalledTimes(1)
      expect(CustomerServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("lebron"),
        {
          billing_address: "test",
        }
      )
    })

    it("status code 200", () => {
      expect(subject.status).toEqual(200)
    })
  })

  describe("successfully updates a customer with billing address object", () => {
    let subject
    beforeAll(async () => {
      subject = await request("POST", `/store/customers/me`, {
        payload: {
          billing_address: {
            first_name: "Olli",
            last_name: "Juhl",
            address_1: "Laksegade",
            city: "Copenhagen",
            country_code: "dk",
            postal_code: "2100",
            phone: "+1 (222) 333 4444",
          },
        },
        clientSession: {
          jwt: {
            customer_id: IdMap.getId("lebron"),
          },
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CustomerService update", () => {
      expect(CustomerServiceMock.update).toHaveBeenCalledTimes(1)
      expect(CustomerServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("lebron"),
        {
          billing_address: {
            first_name: "Olli",
            last_name: "Juhl",
            address_1: "Laksegade",
            city: "Copenhagen",
            country_code: "dk",
            postal_code: "2100",
            phone: "+1 (222) 333 4444",
          },
        }
      )
    })

    it("status code 200", () => {
      expect(subject.status).toEqual(200)
    })
  })
})
