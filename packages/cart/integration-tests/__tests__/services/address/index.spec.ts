import { SqlEntityManager } from "@mikro-orm/postgresql"
import { AddressService } from "../../../../src/services"
import { MikroOrmWrapper } from "../../../utils"
import { createMedusaContainer } from "@medusajs/utils"
import { asValue } from "awilix"
import ContainerLoader from "../../../../src/loaders/container"

jest.setTimeout(30000)

describe("Address Service", () => {
  let service: AddressService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()
    testManager = await MikroOrmWrapper.forkManager()

    const container = createMedusaContainer()
    container.register("manager", asValue(repositoryManager))

    await ContainerLoader({ container })

    service = container.resolve("addressService")
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("create", () => {
    it("should create an address successfully", async () => {
      const [createdAddress] = await service.create([
        {
          first_name: "John",
          last_name: "Doe",
          address_1: "Test street 1",
          city: "Test city",
          country_code: "US",
          postal_code: "12345",
        },
      ])

      const [address] = await service.list({ id: [createdAddress.id] })

      expect(address).toEqual(
        expect.objectContaining({
          id: createdAddress.id,
          first_name: "John",
          last_name: "Doe",
          address_1: "Test street 1",
          city: "Test city",
          country_code: "US",
          postal_code: "12345",
        })
      )
    })
  })

  describe("update", () => {
    it("should throw an error if address does not exist", async () => {
      const error = await service
        .update([
          {
            id: "none-existing",
          },
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        'Address with id "none-existing" not found'
      )
    })

    it("should update an address successfully", async () => {
      const [createdAddress] = await service.create([
        {
          first_name: "Jane",
          last_name: "Doe",
          address_1: "Test street 1",
          city: "Test city",
          country_code: "US",
          postal_code: "12345",
        },
      ])

      await service.update([
        {
          id: createdAddress.id,
          address_1: "Test street 2",
          city: "Test city 2",
        },
      ])

      const [address] = await service.list({ id: [createdAddress.id] })

      expect(address).toEqual(
        expect.objectContaining({
          id: createdAddress.id,
          first_name: "Jane",
          last_name: "Doe",
          address_1: "Test street 2",
          city: "Test city 2",
          country_code: "US",
          postal_code: "12345",
        })
      )
    })
  })

  describe("delete", () => {
    it("should delete a cart successfully", async () => {
      const [createdAddress] = await service.create([
        {
          first_name: "Jane",
          last_name: "Doe",
        },
      ])

      await service.delete([createdAddress.id])

      const carts = await service.list({ id: [createdAddress.id] })

      expect(carts.length).toEqual(0)
    })
  })
})
