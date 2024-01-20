import { ICustomerModuleService } from "@medusajs/types"
import { initialize } from "../../../../src/initialize"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("Customer Module Service", () => {
  let service: ICustomerModuleService

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_CUSTOMER_DB_SCHEMA,
      },
    })
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("create", () => {
    it("should create a customer", async () => {
      const customerPromise = service.create({
        first_name: "John",
        last_name: "Doe",
      })

      await expect(customerPromise).resolves.toEqual(
        expect.objectContaining({
          id: expect.any(String),
          first_name: "John",
          last_name: "Doe",
        })
      )
    })
  })
})
