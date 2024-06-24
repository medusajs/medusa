import { ICustomerModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner } from "medusa-test-utils"
import { Modules } from "@medusajs/utils"

jest.setTimeout(30000)

moduleIntegrationTestRunner<ICustomerModuleService>({
  moduleName: Modules.CUSTOMER,
  testSuite: ({ service }) => {
    describe("Customer Module Service", () => {
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
          const customer = await service.createCustomers(customerData)

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

        it("should create two customers with the same email but one has an account", async () => {
          const customerData = {
            company_name: "Acme Corp",
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@acmecorp.com",
            phone: "123456789",
            created_by: "admin",
            metadata: { membership: "gold" },
          }
          const customerData2 = {
            ...customerData,
            has_account: true,
          }
          const [customer, customer2] = await service.createCustomers([
            customerData,
            customerData2,
          ])

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
          expect(customer2).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              company_name: "Acme Corp",
              first_name: "John",
              last_name: "Doe",
              email: "john.doe@acmecorp.com",
              phone: "123456789",
              created_by: "admin",
              metadata: expect.objectContaining({ membership: "gold" }),
              has_account: true,
            })
          )
        })

        it("should fail to create a duplicated guest customers", async () => {
          const customerData = {
            company_name: "Acme Corp",
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@acmecorp.com",
            phone: "123456789",
            created_by: "admin",
            metadata: { membership: "gold" },
          }

          const err = await service
            .createCustomers([customerData, customerData])
            .catch((err) => err)

          expect(err.message).toBe(
            "Customer with email: john.doe@acmecorp.com, has_account: false, already exists."
          )
        })

        it("should fail to create a duplicated customers", async () => {
          const customerData = {
            company_name: "Acme Corp",
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@acmecorp.com",
            phone: "123456789",
            created_by: "admin",
            metadata: { membership: "gold" },
            has_account: true,
          }

          const err = await service
            .createCustomers([customerData, customerData])
            .catch((err) => err)

          expect(err.message).toBe(
            "Customer with email: john.doe@acmecorp.com, has_account: true, already exists."
          )
        })

        it("should create address", async () => {
          const customerData = {
            company_name: "Acme Corp",
            first_name: "John",
            last_name: "Doe",
            addresses: [
              {
                address_1: "Testvej 1",
                address_2: "Testvej 2",
                city: "Testby",
                country_code: "DK",
                province: "Test",
                postal_code: "8000",
                phone: "123456789",
                metadata: { membership: "gold" },
                is_default_shipping: true,
              },
            ],
          }
          const customer = await service.createCustomers(customerData)

          const [address] = await service.listAddresses({
            customer_id: customer.id,
          })

          expect(address).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              address_1: "Testvej 1",
              address_2: "Testvej 2",
              city: "Testby",
              country_code: "DK",
              province: "Test",
              postal_code: "8000",
              phone: "123456789",
              metadata: expect.objectContaining({ membership: "gold" }),
              is_default_shipping: true,
            })
          )
        })

        it("should fail to create two default shipping", async () => {
          const customerData = {
            company_name: "Acme Corp",
            first_name: "John",
            last_name: "Doe",
            addresses: [
              {
                address_1: "Testvej 1",
                address_2: "Testvej 2",
                city: "Testby",
                country_code: "DK",
                province: "Test",
                postal_code: "8000",
                phone: "123456789",
                metadata: { membership: "gold" },
                is_default_shipping: true,
              },
              {
                address_1: "Test Ave 1",
                address_2: "Test Ave 2",
                city: "Testville",
                country_code: "US",
                is_default_shipping: true,
              },
            ],
          }
          await expect(service.createCustomers(customerData)).rejects.toThrow(
            /Customer address with customer_id: .*? already exists./
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
          const customer = await service.createCustomers(customersData)

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
          const group = await service.createCustomerGroups({
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
          const groups = await service.createCustomerGroups([
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
          await service.createCustomers([
            {
              first_name: "John",
              last_name: "Doe",
              email: "john.doe@example.com",
            },
            {
              first_name: "Jane",
              last_name: "Smith",
              email: "jane.smith@example.com",
            },
          ])

          const customers = await service.listCustomers()

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
          await service.createCustomers([
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
          const customers = await service.listCustomers(filter)

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
          const vipGroup = await service.createCustomerGroups({ name: "VIP" })

          const [john] = await service.createCustomers([
            {
              first_name: "John",
              last_name: "Doe",
              email: "john.doe@example.com",
            },
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
          const customers = await service.listCustomers(filter)

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
          const [customer] = await service.createCustomers([
            {
              first_name: "John",
              last_name: "Doe",
              email: "john.doe@example.com",
            },
          ])
          const [group] = await service.createCustomerGroups([{ name: "VIP" }])

          const result = await service.addCustomerToGroup({
            customer_id: customer.id,
            customer_group_id: group.id,
          })

          expect(result).toEqual(
            expect.objectContaining({ id: expect.any(String) })
          )

          // Additional validation (optional): retrieve the customer and check if the group is assigned
          const updatedCustomer = await service.retrieveCustomer(customer.id, {
            relations: ["groups"],
          })
          expect(updatedCustomer.groups).toContainEqual(
            expect.objectContaining({ id: group.id })
          )
        })

        it("should add multiple customers to customer groups", async () => {
          const customers = await service.createCustomers([
            {
              first_name: "John",
              last_name: "Doe",
              email: "john.doe@example.com",
            },
            {
              first_name: "Jane",
              last_name: "Smith",
              email: "jane.smith@example.com",
            },
          ])
          const groups = await service.createCustomerGroups([
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
            const updatedCustomer = await service.retrieveCustomer(
              customer.id,
              {
                relations: ["groups"],
              }
            )
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
          const [customer] = await service.createCustomers([
            {
              first_name: "John",
              last_name: "Doe",
              email: "john.doe@example.com",
            },
          ])

          const updateData = { first_name: "Jonathan" }
          const updatedCustomer = await service.updateCustomers(
            customer.id,
            updateData
          )

          expect(updatedCustomer).toEqual(
            expect.objectContaining({ id: customer.id, first_name: "Jonathan" })
          )
        })

        it("should update multiple customers by IDs", async () => {
          const customers = await service.createCustomers([
            {
              first_name: "John",
              last_name: "Doe",
              email: "john.doe@example.com",
            },
            {
              first_name: "Jane",
              last_name: "Smith",
              email: "jane.smith@example.com",
            },
          ])

          const updateData = { last_name: "Updated" }
          const customerIds = customers.map((customer) => customer.id)
          const updatedCustomers = await service.updateCustomers(
            customerIds,
            updateData
          )

          updatedCustomers.forEach((updatedCustomer) => {
            expect(updatedCustomer).toEqual(
              expect.objectContaining({ last_name: "Updated" })
            )
          })
        })

        it("should update customers using a selector", async () => {
          await service.createCustomers([
            {
              first_name: "John",
              last_name: "Doe",
              email: "john.doe@example.com",
            },
            {
              first_name: "Jane",
              last_name: "Doe",
              email: "jane.doe@example.com",
            },
          ])

          const selector = { last_name: "Doe" }
          const updateData = { last_name: "Updated" }
          const updatedCustomers = await service.updateCustomers(
            selector,
            updateData
          )

          updatedCustomers.forEach((updatedCustomer) => {
            expect(updatedCustomer).toEqual(
              expect.objectContaining({ last_name: "Updated" })
            )
          })
        })
      })

      describe("delete", () => {
        it("should delete a single customer", async () => {
          const [customer] = await service.createCustomers([
            {
              first_name: "John",
              last_name: "Doe",
              email: "john.doe@example.com",
            },
          ])

          await service.deleteCustomers(customer.id)

          await expect(service.retrieveCustomer(customer.id)).rejects.toThrow(
            `Customer with id: ${customer.id} was not found`
          )
        })

        it("should delete multiple customers by IDs", async () => {
          const customers = await service.createCustomers([
            {
              first_name: "John",
              last_name: "Doe",
              email: "john.doe@example.com",
            },
            {
              first_name: "Jane",
              last_name: "Smith",
              email: "jane.smith@example.com",
            },
          ])

          const customerIds = customers.map((customer) => customer.id)
          await service.deleteCustomers(customerIds)

          for (const customer of customers) {
            await expect(service.retrieveCustomer(customer.id)).rejects.toThrow(
              `Customer with id: ${customer.id} was not found`
            )
          }
        })

        it("should delete customers using a selector", async () => {
          await service.createCustomers([
            {
              first_name: "John",
              last_name: "Doe",
              email: "john.doe@example.com",
            },
            {
              first_name: "Jane",
              last_name: "Doe",
              email: "jane.doe@example.com",
            },
          ])

          const selector = { last_name: "Doe" }
          await service.deleteCustomers(selector)

          const remainingCustomers = await service.listCustomers({
            last_name: "Doe",
          })
          expect(remainingCustomers.length).toBe(0)
        })

        it("should cascade address relationship when deleting customer", async () => {
          // Creating a customer and an address
          const customer = await service.createCustomers({
            first_name: "John",
            last_name: "Doe",
          })
          await service.createAddresses({
            customer_id: customer.id,
            first_name: "John",
            last_name: "Doe",
            postal_code: "10001",
            country_code: "US",
          })

          // verify that the address was added
          const customerWithAddress = await service.retrieveCustomer(
            customer.id,
            {
              relations: ["addresses"],
            }
          )
          expect(customerWithAddress.addresses?.length).toBe(1)

          await service.deleteCustomers(customer.id)

          const res = await service.listAddresses({
            customer_id: customer.id,
          })
          expect(res.length).toBe(0)
        })

        it("should cascade relationship when deleting customer", async () => {
          // Creating a customer and a group
          const customer = await service.createCustomers({
            first_name: "John",
            last_name: "Doe",
          })
          const group = await service.createCustomerGroups({ name: "VIP" })

          // Adding the customer to the groups
          await service.addCustomerToGroup({
            customer_id: customer.id,
            customer_group_id: group.id,
          })

          await service.deleteCustomers(customer.id)

          const res = await service.listCustomerGroupCustomers({
            customer_id: customer.id,
            customer_group_id: group.id,
          })
          expect(res.length).toBe(0)
        })
      })

      describe("deleteCustomerGroup", () => {
        it("should delete a single customer group", async () => {
          const [group] = await service.createCustomerGroups([{ name: "VIP" }])
          await service.deleteCustomerGroups(group.id)

          await expect(
            service.retrieveCustomerGroup(group.id)
          ).rejects.toThrowError(
            `CustomerGroup with id: ${group.id} was not found`
          )
        })

        it("should delete multiple customer groups by IDs", async () => {
          const groups = await service.createCustomerGroups([
            { name: "VIP" },
            { name: "Regular" },
          ])

          const groupIds = groups.map((group) => group.id)
          await service.deleteCustomerGroups(groupIds)

          for (const group of groups) {
            await expect(
              service.retrieveCustomerGroup(group.id)
            ).rejects.toThrowError(
              `CustomerGroup with id: ${group.id} was not found`
            )
          }
        })

        it("should delete customer groups using a selector", async () => {
          await service.createCustomerGroups([
            { name: "VIP" },
            { name: "Regular" },
          ])

          const selector = { name: "VIP" }
          await service.deleteCustomerGroups(selector)

          const remainingGroups = await service.listCustomerGroups({
            name: "VIP",
          })
          expect(remainingGroups.length).toBe(0)
        })

        it("should cascade relationship when deleting customer group", async () => {
          // Creating a customer and a group
          const customer = await service.createCustomers({
            first_name: "John",
            last_name: "Doe",
          })
          const group = await service.createCustomerGroups({ name: "VIP" })

          // Adding the customer to the groups
          await service.addCustomerToGroup({
            customer_id: customer.id,
            customer_group_id: group.id,
          })

          await service.deleteCustomerGroups(group.id)

          const res = await service.listCustomerGroupCustomers({
            customer_id: customer.id,
            customer_group_id: group.id,
          })
          expect(res.length).toBe(0)
        })
      })

      describe("addAddresses", () => {
        it("should add a single address to a customer", async () => {
          const customer = await service.createCustomers({
            first_name: "John",
            last_name: "Doe",
          })
          const address = await service.createAddresses({
            customer_id: customer.id,
            first_name: "John",
            last_name: "Doe",
            postal_code: "10001",
            country_code: "US",
          })
          const [customerWithAddress] = await service.listCustomers(
            { id: customer.id },
            { relations: ["addresses"] }
          )

          expect(customerWithAddress.addresses).toEqual([
            expect.objectContaining({ id: address.id }),
          ])
        })

        it("should add multiple addresses to a customer", async () => {
          const customer = await service.createCustomers({
            first_name: "John",
            last_name: "Doe",
          })
          const addresses = await service.createAddresses([
            {
              customer_id: customer.id,
              first_name: "John",
              last_name: "Doe",
              postal_code: "10001",
              country_code: "US",
            },
            {
              customer_id: customer.id,
              first_name: "John",
              last_name: "Doe",
              postal_code: "10002",
              country_code: "US",
            },
          ])
          const [customerWithAddresses] = await service.listCustomers(
            { id: customer.id },
            { relations: ["addresses"] }
          )

          expect(customerWithAddresses.addresses).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: addresses[0].id }),
              expect.objectContaining({ id: addresses[1].id }),
            ])
          )
        })

        it("should only be possible to add one default shipping address per customer", async () => {
          const customer = await service.createCustomers({
            first_name: "John",
            last_name: "Doe",
          })
          await service.createAddresses({
            customer_id: customer.id,
            first_name: "John",
            last_name: "Doe",
            postal_code: "10001",
            country_code: "US",
            is_default_shipping: true,
          })
          await service.createAddresses({
            customer_id: customer.id,
            first_name: "John",
            last_name: "Doe",
            postal_code: "10001",
            country_code: "US",
            is_default_shipping: false,
          })

          await expect(
            service.createAddresses({
              customer_id: customer.id,
              first_name: "John",
              last_name: "Doe",
              postal_code: "10002",
              country_code: "US",
              is_default_shipping: true,
            })
          ).rejects.toThrow(
            /Customer address with customer_id: .*? already exists./
          )
        })

        it("should only be possible to add one default billing address per customer", async () => {
          const customer = await service.createCustomers({
            first_name: "John",
            last_name: "Doe",
          })
          await service.createAddresses({
            customer_id: customer.id,
            first_name: "John",
            last_name: "Doe",
            postal_code: "10001",
            country_code: "US",
            is_default_billing: true,
          })
          await service.createAddresses({
            customer_id: customer.id,
            first_name: "John",
            last_name: "Doe",
            postal_code: "10001",
            country_code: "US",
            is_default_billing: false,
          })

          await expect(
            service.createAddresses({
              customer_id: customer.id,
              first_name: "John",
              last_name: "Doe",
              postal_code: "10002",
              country_code: "US",
              is_default_billing: true,
            })
          ).rejects.toThrow(
            /Customer address with customer_id: .*? already exists./
          )
        })
      })

      describe("updateAddresses", () => {
        it("should update a single address", async () => {
          const customer = await service.createCustomers({
            first_name: "John",
            last_name: "Doe",
          })
          const address = await service.createAddresses({
            customer_id: customer.id,
            address_name: "Home",
            address_1: "123 Main St",
          })

          await service.updateAddresses(address.id, {
            address_name: "Work",
            address_1: "456 Main St",
          })

          const updatedCustomer = await service.retrieveCustomer(customer.id, {
            select: ["id"],
            relations: ["addresses"],
          })

          expect(updatedCustomer.addresses).toEqual([
            expect.objectContaining({
              id: address.id,
              address_name: "Work",
              address_1: "456 Main St",
            }),
          ])
        })

        it("should update multiple addresses", async () => {
          const customer = await service.createCustomers({
            first_name: "John",
            last_name: "Doe",
          })
          const address1 = await service.createAddresses({
            customer_id: customer.id,
            address_name: "Home",
            address_1: "123 Main St",
          })
          const address2 = await service.createAddresses({
            customer_id: customer.id,
            address_name: "Work",
            address_1: "456 Main St",
          })

          await service.updateAddresses(
            { customer_id: customer.id },
            {
              address_name: "Under Construction",
            }
          )

          const updatedCustomer = await service.retrieveCustomer(customer.id, {
            select: ["id"],
            relations: ["addresses"],
          })

          expect(updatedCustomer.addresses).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: address1.id,
                address_name: "Under Construction",
              }),
              expect.objectContaining({
                id: address2.id,
                address_name: "Under Construction",
              }),
            ])
          )
        })

        it("should update multiple addresses with ids", async () => {
          const customer = await service.createCustomers({
            first_name: "John",
            last_name: "Doe",
          })
          const [address1, address2] = await service.createAddresses([
            {
              customer_id: customer.id,
              address_name: "Home",
              address_1: "123 Main St",
            },
            {
              customer_id: customer.id,
              address_name: "Work",
              address_1: "456 Main St",
            },
          ])

          await service.updateAddresses([address1.id, address2.id], {
            address_name: "Under Construction",
          })

          const updatedCustomer = await service.retrieveCustomer(customer.id, {
            select: ["id"],
            relations: ["addresses"],
          })

          expect(updatedCustomer.addresses).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: address1.id,
                address_name: "Under Construction",
              }),
              expect.objectContaining({
                id: address2.id,
                address_name: "Under Construction",
              }),
            ])
          )
        })

        it("should fail when updating address to a default shipping address when one already exists", async () => {
          const customer = await service.createCustomers({
            first_name: "John",
            last_name: "Doe",
            addresses: [
              {
                address_name: "Home",
                address_1: "123 Main St",
                is_default_shipping: true,
              },
            ],
          })
          const address = await service.createAddresses({
            customer_id: customer.id,
            address_name: "Work",
            address_1: "456 Main St",
          })

          await expect(
            service.updateAddresses(address.id, { is_default_shipping: true })
          ).rejects.toThrow(
            /Customer address with customer_id: .*? already exists./
          )
        })
      })

      describe("listAddresses", () => {
        it("should list all addresses for a customer", async () => {
          const customer = await service.createCustomers({
            first_name: "John",
            last_name: "Doe",
          })
          const [address1, address2] = await service.createAddresses([
            {
              customer_id: customer.id,
              address_name: "Home",
              address_1: "123 Main St",
            },
            {
              customer_id: customer.id,
              address_name: "Work",

              address_1: "456 Main St",
            },
          ])

          const addresses = await service.listAddresses({
            customer_id: customer.id,
          })

          expect(addresses).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: address1.id,
                address_name: "Home",
                address_1: "123 Main St",
              }),
              expect.objectContaining({
                id: address2.id,
                address_name: "Work",
                address_1: "456 Main St",
              }),
            ])
          )
        })
      })

      describe("removeCustomerFromGroup", () => {
        it("should remove a single customer from a group", async () => {
          // Creating a customer and a group
          const [customer] = await service.createCustomers([
            {
              first_name: "John",
              last_name: "Doe",
              email: "john.doe@example.com",
            },
          ])
          const [group] = await service.createCustomerGroups([{ name: "VIP" }])

          // Adding the customer to the group
          await service.addCustomerToGroup({
            customer_id: customer.id,
            customer_group_id: group.id,
          })

          const [customerInGroup] = await service.listCustomers(
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

          const [updatedCustomer] = await service.listCustomers(
            { id: customer.id },
            { relations: ["groups"] }
          )
          expect(updatedCustomer.groups).toEqual([])
        })

        it("should remove multiple customers from groups", async () => {
          // Creating multiple customers and groups
          const customers = await service.createCustomers([
            {
              first_name: "John",
              last_name: "Doe",
              email: "john.doe@example.com",
            },
            {
              first_name: "Jane",
              last_name: "Smith",
              email: "jane.smith@example.com",
            },
          ])
          const groups = await service.createCustomerGroups([
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
            const [updatedCustomer] = await service.listCustomers(
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
          const [customer] = await service.createCustomers([
            { first_name: "John", last_name: "Doe" },
          ])
          await service.softDeleteCustomers([customer.id])

          const res = await service.listCustomers({ id: customer.id })
          expect(res.length).toBe(0)

          const deletedCustomer = await service.retrieveCustomer(customer.id, {
            withDeleted: true,
          })

          expect(deletedCustomer.deleted_at).not.toBeNull()
        })

        it("should soft delete multiple customers", async () => {
          const customers = await service.createCustomers([
            { first_name: "John", last_name: "Doe" },
            { first_name: "Jane", last_name: "Smith" },
          ])
          const customerIds = customers.map((customer) => customer.id)
          await service.softDeleteCustomers(customerIds)

          const res = await service.listCustomers({ id: customerIds })
          expect(res.length).toBe(0)

          const deletedCustomers = await service.listCustomers(
            { id: customerIds },
            { withDeleted: true }
          )
          expect(deletedCustomers.length).toBe(2)
        })

        it("should remove customer in group relation", async () => {
          // Creating a customer and a group
          const customer = await service.createCustomers({
            first_name: "John",
            last_name: "Doe",
          })
          const group = await service.createCustomerGroups({ name: "VIP" })

          // Adding the customer to the group
          await service.addCustomerToGroup({
            customer_id: customer.id,
            customer_group_id: group.id,
          })

          await service.softDeleteCustomers([customer.id])

          const resGroup = await service.retrieveCustomerGroup(group.id, {
            relations: ["customers"],
          })
          expect(resGroup.customers?.length).toBe(0)
        })
      })

      describe("restore", () => {
        it("should restore a single customer", async () => {
          const [customer] = await service.createCustomers([
            { first_name: "John", last_name: "Doe" },
          ])
          await service.softDeleteCustomers([customer.id])

          const res = await service.listCustomers({ id: customer.id })
          expect(res.length).toBe(0)

          await service.restoreCustomers([customer.id])

          const restoredCustomer = await service.retrieveCustomer(customer.id, {
            withDeleted: true,
          })
          expect(restoredCustomer.deleted_at).toBeNull()
        })

        it("should restore multiple customers", async () => {
          const customers = await service.createCustomers([
            { first_name: "John", last_name: "Doe" },
            { first_name: "Jane", last_name: "Smith" },
          ])
          const customerIds = customers.map((customer) => customer.id)
          await service.softDeleteCustomers(customerIds)

          const res = await service.listCustomers({ id: customerIds })
          expect(res.length).toBe(0)

          await service.restoreCustomers(customerIds)

          const restoredCustomers = await service.listCustomers(
            { id: customerIds },
            { withDeleted: true }
          )
          expect(restoredCustomers.length).toBe(2)
        })
      })

      describe("softDeleteCustomerGroup", () => {
        it("should soft delete a single customer group", async () => {
          const [group] = await service.createCustomerGroups([{ name: "VIP" }])
          await service.softDeleteCustomerGroups([group.id])

          const res = await service.listCustomerGroups({ id: group.id })
          expect(res.length).toBe(0)

          const deletedGroup = await service.retrieveCustomerGroup(group.id, {
            withDeleted: true,
          })

          expect(deletedGroup.deleted_at).not.toBeNull()
        })

        it("should soft delete multiple customer groups", async () => {
          const groups = await service.createCustomerGroups([
            { name: "VIP" },
            { name: "Regular" },
          ])
          const groupIds = groups.map((group) => group.id)
          await service.softDeleteCustomerGroups(groupIds)

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
          const [group] = await service.createCustomerGroups([{ name: "VIP" }])
          await service.softDeleteCustomerGroups([group.id])

          const res = await service.listCustomerGroups({ id: group.id })
          expect(res.length).toBe(0)

          await service.restoreCustomerGroups([group.id])

          const restoredGroup = await service.retrieveCustomerGroup(group.id, {
            withDeleted: true,
          })
          expect(restoredGroup.deleted_at).toBeNull()
        })

        it("should restore multiple customer groups", async () => {
          const groups = await service.createCustomerGroups([
            { name: "VIP" },
            { name: "Regular" },
          ])
          const groupIds = groups.map((group) => group.id)
          await service.softDeleteCustomerGroups(groupIds)

          const res = await service.listCustomerGroups({ id: groupIds })
          expect(res.length).toBe(0)

          await service.restoreCustomerGroups(groupIds)

          const restoredGroups = await service.listCustomerGroups(
            { id: groupIds },
            { withDeleted: true }
          )
          expect(restoredGroups.length).toBe(2)
        })
      })
    })
  },
})
