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
    it("should create a single customer", async () => {
      const customerData = {
        company_name: "Acme Corp",
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@acmecorp.com",
        phone: "123456789",
        created_by: "admin",
        metadata: { membership: "gold" },
      }
      const customer = await service.create(customerData)

      expect(customer).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          company_name: "Acme Corp",
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@acmecorp.com",
          phone: "123456789",
          created_by: "admin",
          metadata: expect.objectContaining({ membership: "gold" }),
        })
      )
    })

    it("should create multiple customers", async () => {
      const customersData = [
        {
          company_name: "Acme Corp",
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@acmecorp.com",
          phone: "123456789",
          created_by: "admin",
          metadata: { membership: "gold" },
        },
        {
          first_name: "Jane",
          last_name: "Smith",
          email: "jane.smith@example.com",
          phone: "987654321",
          metadata: { membership: "silver" },
        },
      ]
      const customer = await service.create(customersData)

      expect(customer).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            company_name: "Acme Corp",
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@acmecorp.com",
            phone: "123456789",
            created_by: "admin",
            metadata: expect.objectContaining({ membership: "gold" }),
          }),
          expect.objectContaining({
            id: expect.any(String),
            first_name: "Jane",
            last_name: "Smith",
            email: "jane.smith@example.com",
            phone: "987654321",
            metadata: expect.objectContaining({ membership: "silver" }),
          }),
        ])
      )
    })
  })

  describe("createCustomerGroup", () => {
    it("should create a single customer group", async () => {
      const group = await service.createCustomerGroup({
        name: "VIP Customers",
        metadata: { priority: "high" },
        created_by: "admin",
      })

      expect(group).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: "VIP Customers",
          metadata: expect.objectContaining({ priority: "high" }),
          created_by: "admin",
        })
      )
    })

    it("should create multiple customer groups", async () => {
      const groups = await service.createCustomerGroup([
        {
          name: "VIP Customers",
          metadata: { priority: "high" },
          created_by: "admin",
        },
        {
          name: "Regular Customers",
          metadata: { discount: "10%" },
          created_by: "staff",
        },
      ])

      expect(group).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: "VIP Customers",
            metadata: expect.objectContaining({ priority: "high" }),
            created_by: "admin",
          }),
          expect.objectContaining({
            id: expect.any(String),
            name: "Regular Customers",
            metadata: expect.objectContaining({ discount: "10%" }),
            created_by: "staff",
          }),
        ])
      )
    })
  })

  describe("list", () => {
    it("should list all customers when no filters are applied", async () => {
      await service.create([
        { first_name: "John", last_name: "Doe", email: "john.doe@example.com" },
        {
          first_name: "Jane",
          last_name: "Smith",
          email: "jane.smith@example.com",
        },
      ])

      const customers = await service.list()

      expect(customers.length).toBeGreaterThanOrEqual(2)
      expect(customers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
          }),
          expect.objectContaining({
            first_name: "Jane",
            last_name: "Smith",
            email: "jane.smith@example.com",
          }),
        ])
      )
    })

    it("should list customers filtered by a specific email", async () => {
      await service.create([
        {
          first_name: "John",
          last_name: "Doe",
          email: "unique.email@example.com",
        },
        {
          first_name: "Jane",
          last_name: "Smith",
          email: "jane.smith@example.com",
        },
      ])

      const filter = { email: "unique.email@example.com" }
      const customers = await service.list(filter)

      expect(customers.length).toBe(1)
      expect(customers[0]).toEqual(
        expect.objectContaining({
          first_name: "John",
          last_name: "Doe",
          email: "unique.email@example.com",
        })
      )
    })

    it("should list customers by a specific customer group", async () => {
      const vipGroup = await service.createCustomerGroup({ name: "VIP" })

      const [john] = await service.create([
        { first_name: "John", last_name: "Doe", email: "john.doe@example.com" },
        {
          first_name: "Jane",
          last_name: "Smith",
          email: "jane.smith@example.com",
        },
      ])

      await service.addCustomerToGroup({
        customer_id: john.id,
        customer_group_id: vipGroup.id,
      })

      const filter = { groups: vipGroup.id }
      const customers = await service.list(filter)

      expect(customers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
          }),
        ])
      )
      expect(customers).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            first_name: "Jane",
            last_name: "Smith",
            email: "jane.smith@example.com",
          }),
        ])
      )
    })
  })

  describe("addCustomerToGroup", () => {
    it("should add a single customer to a customer group", async () => {
      const [customer] = await service.create([
        { first_name: "John", last_name: "Doe", email: "john.doe@example.com" },
      ])
      const [group] = await service.createCustomerGroup([{ name: "VIP" }])

      const result = await service.addCustomerToGroup({
        customer_id: customer.id,
        customer_group_id: group.id,
      })

      expect(result).toEqual(
        expect.objectContaining({ id: expect.any(String) })
      )

      // Additional validation (optional): retrieve the customer and check if the group is assigned
      const updatedCustomer = await service.retrieve(customer.id, {
        relations: ["groups"],
      })
      expect(updatedCustomer.groups).toContainEqual(
        expect.objectContaining({ id: group.id })
      )
    })

    it("should add multiple customers to customer groups", async () => {
      const customers = await service.create([
        { first_name: "John", last_name: "Doe", email: "john.doe@example.com" },
        {
          first_name: "Jane",
          last_name: "Smith",
          email: "jane.smith@example.com",
        },
      ])
      const groups = await service.createCustomerGroup([
        { name: "VIP" },
        { name: "Regular" },
      ])

      const pairs = customers.map((customer, index) => ({
        customer_id: customer.id,
        customer_group_id: groups[index % groups.length].id,
      }))

      const results = await service.addCustomerToGroup(pairs)

      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: expect.any(String) }),
          expect.objectContaining({ id: expect.any(String) }),
        ])
      )

      for (const customer of customers) {
        const updatedCustomer = await service.retrieve(customer.id, {
          relations: ["groups"],
        })
        expect(updatedCustomer.groups).toContainEqual(
          expect.objectContaining({
            id: groups[customers.indexOf(customer) % groups.length].id,
          })
        )
      }
    })
  })
})
