import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  ICartModuleService,
  ICustomerModuleService,
  IPricingModuleService,
  IProductModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
} from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import adminSeeder from "../../../../helpers/admin-seeder"
import { createAuthenticatedCustomer } from "../../../helpers/create-authenticated-customer"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

describe("Store Carts API", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let cartModuleService: ICartModuleService
  let regionModuleService: IRegionModuleService
  let scModuleService: ISalesChannelModuleService
  let customerModule: ICustomerModuleService
  let productModule: IProductModuleService
  let pricingModule: IPricingModuleService
  let remoteLink

  let defaultRegion

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    cartModuleService = appContainer.resolve(ModuleRegistrationName.CART)
    regionModuleService = appContainer.resolve(ModuleRegistrationName.REGION)
    scModuleService = appContainer.resolve(ModuleRegistrationName.SALES_CHANNEL)
    customerModule = appContainer.resolve(ModuleRegistrationName.CUSTOMER)
    productModule = appContainer.resolve(ModuleRegistrationName.PRODUCT)
    pricingModule = appContainer.resolve(ModuleRegistrationName.PRICING)
    remoteLink = appContainer.resolve("remoteLink")
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  beforeEach(async () => {
    await adminSeeder(dbConnection)
    await regionModuleService.createDefaultCountriesAndCurrencies()

    // Here, so we don't have to create a region for each test
    defaultRegion = await regionModuleService.create({
      name: "Default Region",
      currency_code: "dkk",
    })
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  describe("POST /store/carts", () => {
    it("should create a cart", async () => {
      const region = await regionModuleService.create({
        name: "US",
        currency_code: "usd",
      })

      const salesChannel = await scModuleService.create({
        name: "Webshop",
      })

      const [product] = await productModule.create([
        {
          title: "Test product",
          variants: [
            {
              title: "Test variant",
            },
            {
              title: "Test variant 2",
            },
          ],
        },
      ])

      const [priceSet, priceSetTwo] = await pricingModule.create([
        {
          prices: [
            {
              amount: 3000,
              currency_code: "usd",
            },
          ],
        },
        {
          prices: [
            {
              amount: 4000,
              currency_code: "usd",
            },
          ],
        },
      ])

      await remoteLink.create([
        {
          productService: {
            variant_id: product.variants[0].id,
          },
          pricingService: {
            price_set_id: priceSet.id,
          },
        },
        {
          productService: {
            variant_id: product.variants[1].id,
          },
          pricingService: {
            price_set_id: priceSetTwo.id,
          },
        },
      ])

      const api = useApi() as any

      const created = await api.post(`/store/carts`, {
        email: "tony@stark.com",
        currency_code: "usd",
        region_id: region.id,
        sales_channel_id: salesChannel.id,
        items: [
          {
            variant_id: product.variants[0].id,
            quantity: 1,
          },
          {
            variant_id: product.variants[1].id,
            quantity: 2,
          },
        ],
      })

      expect(created.status).toEqual(200)
      expect(created.data.cart).toEqual(
        expect.objectContaining({
          id: created.data.cart.id,
          currency_code: "usd",
          email: "tony@stark.com",
          region: expect.objectContaining({
            id: region.id,
            currency_code: "usd",
          }),
          sales_channel_id: salesChannel.id,
          customer: expect.objectContaining({
            email: "tony@stark.com",
          }),
          items: expect.arrayContaining([
            expect.objectContaining({
              quantity: 1,
              unit_price: 3000,
            }),
            expect.objectContaining({
              quantity: 2,
              unit_price: 4000,
            }),
          ]),
        })
      )
    })

    it("should create cart with customer from email", async () => {
      const api = useApi() as any

      const created = await api.post(`/store/carts`, {
        currency_code: "usd",
        email: "tony@stark-industries.com",
      })

      expect(created.status).toEqual(200)
      expect(created.data.cart).toEqual(
        expect.objectContaining({
          id: created.data.cart.id,
          currency_code: "usd",
          email: "tony@stark-industries.com",
          customer: expect.objectContaining({
            id: expect.any(String),
            email: "tony@stark-industries.com",
          }),
        })
      )
    })

    it("should create cart with any region", async () => {
      await regionModuleService.create({
        name: "US",
        currency_code: "usd",
      })

      const api = useApi() as any
      const response = await api.post(`/store/carts`, {
        email: "tony@stark.com",
        currency_code: "usd",
      })

      expect(response.status).toEqual(200)
      expect(response.data.cart).toEqual(
        expect.objectContaining({
          id: response.data.cart.id,
          currency_code: "usd",
          email: "tony@stark.com",
          region: expect.objectContaining({
            id: expect.any(String),
          }),
        })
      )
    })

    it("should create cart with region currency code", async () => {
      const region = await regionModuleService.create({
        name: "US",
        currency_code: "usd",
      })

      const api = useApi() as any
      const response = await api.post(`/store/carts`, {
        email: "tony@stark.com",
        region_id: region.id,
      })

      expect(response.status).toEqual(200)
      expect(response.data.cart).toEqual(
        expect.objectContaining({
          id: response.data.cart.id,
          currency_code: "usd",
          email: "tony@stark.com",
          region: expect.objectContaining({
            id: region.id,
          }),
        })
      )
    })

    it("should create cart with logged-in customer", async () => {
      const { customer, jwt } = await createAuthenticatedCustomer(appContainer)

      const api = useApi() as any
      const response = await api.post(
        `/store/carts`,
        {},
        {
          headers: { authorization: `Bearer ${jwt}` },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.cart).toEqual(
        expect.objectContaining({
          id: response.data.cart.id,
          currency_code: "dkk",
          email: customer.email,
          customer: expect.objectContaining({
            id: customer.id,
            email: customer.email,
          }),
        })
      )
    })

    it("should respond 400 bad request on unknown props", async () => {
      const api = useApi() as any

      await expect(
        api.post(`/store/carts`, {
          foo: "bar",
        })
      ).rejects.toThrow()
    })
  })

  describe("GET /store/carts/:id", () => {
    it("should create and update a cart", async () => {
      const region = await regionModuleService.create({
        name: "US",
        currency_code: "usd",
      })

      const salesChannel = await scModuleService.create({
        name: "Webshop",
      })

      const api = useApi() as any

      const created = await api.post(`/store/carts`, {
        email: "tony@stark.com",
        currency_code: "usd",
        region_id: region.id,
        sales_channel_id: salesChannel.id,
      })

      expect(created.status).toEqual(200)
      expect(created.data.cart).toEqual(
        expect.objectContaining({
          id: created.data.cart.id,
          currency_code: "usd",
          email: "tony@stark.com",
          region: expect.objectContaining({
            id: region.id,
            currency_code: "usd",
          }),
          sales_channel_id: salesChannel.id,
        })
      )

      const updated = await api.post(`/store/carts/${created.data.cart.id}`, {
        email: "tony@stark-industries.com",
      })

      expect(updated.status).toEqual(200)
      expect(updated.data.cart).toEqual(
        expect.objectContaining({
          id: updated.data.cart.id,
          currency_code: "usd",
          email: "tony@stark-industries.com",
        })
      )
    })
  })

  describe("GET /store/carts", () => {
    it("should get cart", async () => {
      const region = await regionModuleService.create({
        name: "US",
        currency_code: "usd",
      })

      const salesChannel = await scModuleService.create({
        name: "Webshop",
      })

      const cart = await cartModuleService.create({
        currency_code: "usd",
        items: [
          {
            unit_price: 1000,
            quantity: 1,
            title: "Test item",
          },
        ],
        region_id: region.id,
        sales_channel_id: salesChannel.id,
      })

      const api = useApi() as any
      const response = await api.get(`/store/carts/${cart.id}`)

      expect(response.status).toEqual(200)
      expect(response.data.cart).toEqual(
        expect.objectContaining({
          id: cart.id,
          currency_code: "usd",
          items: expect.arrayContaining([
            expect.objectContaining({
              unit_price: 1000,
              quantity: 1,
              title: "Test item",
            }),
          ]),
          region: expect.objectContaining({
            id: region.id,
            currency_code: "usd",
          }),
          sales_channel_id: salesChannel.id,
        })
      )
    })
  })

  describe("POST /store/carts/:id/line-items", () => {
    it("should add item to cart", async () => {
      const cart = await cartModuleService.create({
        currency_code: "usd",
      })

      const [product] = await productModule.create([
        {
          title: "Test product",
          variants: [
            {
              title: "Test variant",
            },
          ],
        },
      ])

      const priceSet = await pricingModule.create({
        prices: [
          {
            amount: 3000,
            currency_code: "usd",
          },
        ],
      })

      await remoteLink.create([
        {
          productService: {
            variant_id: product.variants[0].id,
          },
          pricingService: {
            price_set_id: priceSet.id,
          },
        },
      ])

      const api = useApi() as any
      const response = await api.post(`/store/carts/${cart.id}/line-items`, {
        variant_id: product.variants[0].id,
        quantity: 1,
      })

      expect(response.status).toEqual(200)
      expect(response.data.cart).toEqual(
        expect.objectContaining({
          id: cart.id,
          currency_code: "usd",
          items: expect.arrayContaining([
            expect.objectContaining({
              unit_price: 3000,
              quantity: 1,
              title: "Test variant",
            }),
          ]),
        })
      )
    })
  })
})
