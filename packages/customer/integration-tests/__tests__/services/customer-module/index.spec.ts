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

    it.only("playground", async () => {
      const cus1 = await service.create({
        first_name: "John",
        last_name: "Doe",
      })

      const cus2 = await service.create({
        first_name: "Jane",
        last_name: "Doe",
      })

      const group1 = await service.createCustomerGroup({ name: "Group 1" })
      const group2 = await service.createCustomerGroup({ name: "Group 2" })

      await service.addCustomerToGroup({
        customer_id: cus2.id,
        customer_group_id: group2.id,
      })

      await service.addCustomerToGroup([
        { customer_id: cus1.id, customer_group_id: group1.id },
      ])

      const groups = await service.listCustomerGroups(
        { customers: cus1.id },
        {
          relations: ["customers"],
        }
      )

      const customers = await service.list(
        {},
        {
          relations: ["groups"],
        }
      )

      console.log(JSON.stringify(groups, null, 2))
      console.log(JSON.stringify(customers, null, 2))

      expect(true).toEqual(true)
    })
  })
})
