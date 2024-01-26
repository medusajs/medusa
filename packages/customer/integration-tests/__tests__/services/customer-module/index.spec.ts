import { ICustomerModuleService } from "@medusajs/types"
import { MikroOrmWrapper } from "../../../utils"
import { Modules } from "@medusajs/modules-sdk"
import { initModules } from "medusa-test-utils"
import { getInitModuleConfig } from "../../../utils/get-init-module-config"

jest.setTimeout(30000)

describe("Customer Module Service", () => {
  let service: ICustomerModuleService
  let shutdownFunc: () => Promise<void>

  beforeAll(async () => {
    const initModulesConfig = getInitModuleConfig()

    const { medusaApp, shutdown } = await initModules(initModulesConfig)

    service = medusaApp.modules[Modules.CUSTOMER]

    shutdownFunc = shutdown
  })

  afterAll(async () => {
    await shutdownFunc()
  })

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
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

      expect(groups).toEqual(
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

  describe("update", () => {
    it("should update a single customer", async () => {
      const [customer] = await service.create([
        { first_name: "John", last_name: "Doe", email: "john.doe@example.com" },
      ])

      const updateData = { first_name: "Jonathan" }
      const updatedCustomer = await service.update(customer.id, updateData)

      expect(updatedCustomer).toEqual(
        expect.objectContaining({ id: customer.id, first_name: "Jonathan" })
      )
    })

    it("should update multiple customers by IDs", async () => {
      const customers = await service.create([
        { first_name: "John", last_name: "Doe", email: "john.doe@example.com" },
        {
          first_name: "Jane",
          last_name: "Smith",
          email: "jane.smith@example.com",
        },
      ])

      const updateData = { last_name: "Updated" }
      const customerIds = customers.map((customer) => customer.id)
      const updatedCustomers = await service.update(customerIds, updateData)

      updatedCustomers.forEach((updatedCustomer) => {
        expect(updatedCustomer).toEqual(
          expect.objectContaining({ last_name: "Updated" })
        )
      })
    })

    it("should update customers using a selector", async () => {
      await service.create([
        { first_name: "John", last_name: "Doe", email: "john.doe@example.com" },
        { first_name: "Jane", last_name: "Doe", email: "jane.doe@example.com" },
      ])

      const selector = { last_name: "Doe" }
      const updateData = { last_name: "Updated" }
      const updatedCustomers = await service.update(selector, updateData)

      updatedCustomers.forEach((updatedCustomer) => {
        expect(updatedCustomer).toEqual(
          expect.objectContaining({ last_name: "Updated" })
        )
      })
    })
  })

  describe("delete", () => {
    it("should delete a single customer", async () => {
      const [customer] = await service.create([
        { first_name: "John", last_name: "Doe", email: "john.doe@example.com" },
      ])

      await service.delete(customer.id)

      await expect(service.retrieve(customer.id)).rejects.toThrow(
        `Customer with id: ${customer.id} was not found`
      )
    })

    it("should delete multiple customers by IDs", async () => {
      const customers = await service.create([
        { first_name: "John", last_name: "Doe", email: "john.doe@example.com" },
        {
          first_name: "Jane",
          last_name: "Smith",
          email: "jane.smith@example.com",
        },
      ])

      const customerIds = customers.map((customer) => customer.id)
      await service.delete(customerIds)

      for (const customer of customers) {
        await expect(service.retrieve(customer.id)).rejects.toThrow(
          `Customer with id: ${customer.id} was not found`
        )
      }
    })

    it("should delete customers using a selector", async () => {
      await service.create([
        { first_name: "John", last_name: "Doe", email: "john.doe@example.com" },
        { first_name: "Jane", last_name: "Doe", email: "jane.doe@example.com" },
      ])

      const selector = { last_name: "Doe" }
      await service.delete(selector)

      const remainingCustomers = await service.list({ last_name: "Doe" })
      expect(remainingCustomers.length).toBe(0)
    })

    it("should cascade relationship when deleting customer", async () => {
      // Creating a customer and a group
      const customer = await service.create({
        first_name: "John",
        last_name: "Doe",
      })
      const group = await service.createCustomerGroup({ name: "VIP" })

      // Adding the customer to the groups
      await service.addCustomerToGroup({
        customer_id: customer.id,
        customer_group_id: group.id,
      })

      await service.delete(customer.id)

      const res = await service.listCustomerGroupRelations({
        customer_id: customer.id,
        customer_group_id: group.id,
      })
      expect(res.length).toBe(0)
    })
  })

  describe("deleteCustomerGroup", () => {
    it("should delete a single customer group", async () => {
      const [group] = await service.createCustomerGroup([{ name: "VIP" }])
      await service.deleteCustomerGroup(group.id)

      await expect(
        service.retrieveCustomerGroup(group.id)
      ).rejects.toThrowError(`CustomerGroup with id: ${group.id} was not found`)
    })

    it("should delete multiple customer groups by IDs", async () => {
      const groups = await service.createCustomerGroup([
        { name: "VIP" },
        { name: "Regular" },
      ])

      const groupIds = groups.map((group) => group.id)
      await service.deleteCustomerGroup(groupIds)

      for (const group of groups) {
        await expect(
          service.retrieveCustomerGroup(group.id)
        ).rejects.toThrowError(
          `CustomerGroup with id: ${group.id} was not found`
        )
      }
    })

    it("should delete customer groups using a selector", async () => {
      await service.createCustomerGroup([{ name: "VIP" }, { name: "Regular" }])

      const selector = { name: "VIP" }
      await service.deleteCustomerGroup(selector)

      const remainingGroups = await service.listCustomerGroups({ name: "VIP" })
      expect(remainingGroups.length).toBe(0)
    })

    it("should cascade relationship when deleting customer group", async () => {
      // Creating a customer and a group
      const customer = await service.create({
        first_name: "John",
        last_name: "Doe",
      })
      const group = await service.createCustomerGroup({ name: "VIP" })

      // Adding the customer to the groups
      await service.addCustomerToGroup({
        customer_id: customer.id,
        customer_group_id: group.id,
      })

      await service.deleteCustomerGroup(group.id)

      const res = await service.listCustomerGroupRelations({
        customer_id: customer.id,
        customer_group_id: group.id,
      })
      expect(res.length).toBe(0)
    })
  })

  describe("removeCustomerFromGroup", () => {
    it("should remove a single customer from a group", async () => {
      // Creating a customer and a group
      const [customer] = await service.create([
        { first_name: "John", last_name: "Doe", email: "john.doe@example.com" },
      ])
      const [group] = await service.createCustomerGroup([{ name: "VIP" }])

      // Adding the customer to the group
      await service.addCustomerToGroup({
        customer_id: customer.id,
        customer_group_id: group.id,
      })

      const [customerInGroup] = await service.list(
        { id: customer.id },
        { relations: ["groups"] }
      )
      expect(customerInGroup.groups).toEqual([
        expect.objectContaining({ id: group.id }),
      ])

      // Removing the customer from the group
      await service.removeCustomerFromGroup({
        customer_id: customer.id,
        customer_group_id: group.id,
      })

      const [updatedCustomer] = await service.list(
        { id: customer.id },
        { relations: ["groups"] }
      )
      expect(updatedCustomer.groups).toEqual([])
    })

    it("should remove multiple customers from groups", async () => {
      // Creating multiple customers and groups
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

      // Adding customers to groups
      const pairsToAdd = [
        { customer_id: customers[0].id, customer_group_id: groups[0].id },
        { customer_id: customers[1].id, customer_group_id: groups[1].id },
      ]
      await service.addCustomerToGroup(pairsToAdd)

      // Removing customers from groups
      const pairsToRemove = [
        { customer_id: customers[0].id, customer_group_id: groups[0].id },
        { customer_id: customers[1].id, customer_group_id: groups[1].id },
      ]
      await service.removeCustomerFromGroup(pairsToRemove)

      // Verification for each customer
      for (const pair of pairsToRemove) {
        const [updatedCustomer] = await service.list(
          { id: pair.customer_id },
          { relations: ["groups"] }
        )
        expect(updatedCustomer.groups).not.toContainEqual(
          expect.objectContaining({ id: pair.customer_group_id })
        )
      }
    })
  })

  describe("softDelete", () => {
    it("should soft delete a single customer", async () => {
      const [customer] = await service.create([
        { first_name: "John", last_name: "Doe" },
      ])
      await service.softDelete([customer.id])

      const res = await service.list({ id: customer.id })
      expect(res.length).toBe(0)

      const deletedCustomer = await service.retrieve(customer.id, {
        withDeleted: true,
      })

      expect(deletedCustomer.deleted_at).not.toBeNull()
    })

    it("should soft delete multiple customers", async () => {
      const customers = await service.create([
        { first_name: "John", last_name: "Doe" },
        { first_name: "Jane", last_name: "Smith" },
      ])
      const customerIds = customers.map((customer) => customer.id)
      await service.softDelete(customerIds)

      const res = await service.list({ id: customerIds })
      expect(res.length).toBe(0)

      const deletedCustomers = await service.list(
        { id: customerIds },
        { withDeleted: true }
      )
      expect(deletedCustomers.length).toBe(2)
    })

    it("should remove customer in group relation", async () => {
      // Creating a customer and a group
      const customer = await service.create({
        first_name: "John",
        last_name: "Doe",
      })
      const group = await service.createCustomerGroup({ name: "VIP" })

      // Adding the customer to the group
      await service.addCustomerToGroup({
        customer_id: customer.id,
        customer_group_id: group.id,
      })

      await service.softDelete([customer.id])

      const resGroup = await service.retrieveCustomerGroup(group.id, {
        relations: ["customers"],
      })
      expect(resGroup.customers?.length).toBe(0)
    })
  })

  describe("restore", () => {
    it("should restore a single customer", async () => {
      const [customer] = await service.create([
        { first_name: "John", last_name: "Doe" },
      ])
      await service.softDelete([customer.id])

      const res = await service.list({ id: customer.id })
      expect(res.length).toBe(0)

      await service.restore([customer.id])

      const restoredCustomer = await service.retrieve(customer.id, {
        withDeleted: true,
      })
      expect(restoredCustomer.deleted_at).toBeNull()
    })

    it("should restore multiple customers", async () => {
      const customers = await service.create([
        { first_name: "John", last_name: "Doe" },
        { first_name: "Jane", last_name: "Smith" },
      ])
      const customerIds = customers.map((customer) => customer.id)
      await service.softDelete(customerIds)

      const res = await service.list({ id: customerIds })
      expect(res.length).toBe(0)

      await service.restore(customerIds)

      const restoredCustomers = await service.list(
        { id: customerIds },
        { withDeleted: true }
      )
      expect(restoredCustomers.length).toBe(2)
    })
  })

  describe("softDeleteCustomerGroup", () => {
    it("should soft delete a single customer group", async () => {
      const [group] = await service.createCustomerGroup([{ name: "VIP" }])
      await service.softDeleteCustomerGroup([group.id])

      const res = await service.listCustomerGroups({ id: group.id })
      expect(res.length).toBe(0)

      const deletedGroup = await service.retrieveCustomerGroup(group.id, {
        withDeleted: true,
      })

      expect(deletedGroup.deleted_at).not.toBeNull()
    })

    it("should soft delete multiple customer groups", async () => {
      const groups = await service.createCustomerGroup([
        { name: "VIP" },
        { name: "Regular" },
      ])
      const groupIds = groups.map((group) => group.id)
      await service.softDeleteCustomerGroup(groupIds)

      const res = await service.listCustomerGroups({ id: groupIds })
      expect(res.length).toBe(0)

      const deletedGroups = await service.listCustomerGroups(
        { id: groupIds },
        { withDeleted: true }
      )
      expect(deletedGroups.length).toBe(2)
    })
  })

  describe("restoreCustomerGroup", () => {
    it("should restore a single customer group", async () => {
      const [group] = await service.createCustomerGroup([{ name: "VIP" }])
      await service.softDeleteCustomerGroup([group.id])

      const res = await service.listCustomerGroups({ id: group.id })
      expect(res.length).toBe(0)

      await service.restoreCustomerGroup([group.id])

      const restoredGroup = await service.retrieveCustomerGroup(group.id, {
        withDeleted: true,
      })
      expect(restoredGroup.deleted_at).toBeNull()
    })

    it("should restore multiple customer groups", async () => {
      const groups = await service.createCustomerGroup([
        { name: "VIP" },
        { name: "Regular" },
      ])
      const groupIds = groups.map((group) => group.id)
      await service.softDeleteCustomerGroup(groupIds)

      const res = await service.listCustomerGroups({ id: groupIds })
      expect(res.length).toBe(0)

      await service.restoreCustomerGroup(groupIds)

      const restoredGroups = await service.listCustomerGroups(
        { id: groupIds },
        { withDeleted: true }
      )
      expect(restoredGroups.length).toBe(2)
    })
  })
})
