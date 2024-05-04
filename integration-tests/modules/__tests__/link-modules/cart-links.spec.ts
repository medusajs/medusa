import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import {
  ICartModuleService,
  ICustomerModuleService,
  IPaymentModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
} from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Cart links", () => {
      let appContainer
      let cartModuleService: ICartModuleService
      let regionModule: IRegionModuleService
      let customerModule: ICustomerModuleService
      let scModuleService: ISalesChannelModuleService
      let paymentModuleService: IPaymentModuleService
      let remoteQuery, remoteLink

      beforeAll(async () => {
        appContainer = getContainer()
        cartModuleService = appContainer.resolve(ModuleRegistrationName.CART)
        regionModule = appContainer.resolve(ModuleRegistrationName.REGION)
        customerModule = appContainer.resolve(ModuleRegistrationName.CUSTOMER)
        scModuleService = appContainer.resolve(
          ModuleRegistrationName.SALES_CHANNEL
        )
        regionModule = appContainer.resolve(ModuleRegistrationName.REGION)
        paymentModuleService = appContainer.resolve(
          ModuleRegistrationName.PAYMENT
        )
        remoteQuery = appContainer.resolve("remoteQuery")
        remoteLink = appContainer.resolve("remoteLink")
      })

      it("should query carts, sales channels, customers, regions with remote query", async () => {
        const region = await regionModule.create({
          name: "Region",
          currency_code: "usd",
        })

        const customer = await customerModule.create({
          email: "tony@stark.com",
        })

        const salesChannel = await scModuleService.create({
          name: "Webshop",
        })

        const cart = await cartModuleService.create({
          email: "tony@stark.com",
          currency_code: "usd",
          region_id: region.id,
          sales_channel_id: salesChannel.id,
          customer_id: customer.id,
        })

        const paymentCollection =
          await paymentModuleService.createPaymentCollections({
            currency_code: "usd",
            region_id: region.id,
            amount: 1000,
          })

        await remoteLink.create([
          {
            [Modules.CART]: {
              cart_id: cart.id,
            },
            [Modules.PAYMENT]: {
              payment_collection_id: paymentCollection.id,
            },
          },
        ])

        const carts = await remoteQuery({
          cart: {
            fields: ["id"],
            region: {
              fields: ["id"],
            },
            customer: {
              fields: ["id"],
            },
            sales_channel: {
              fields: ["id"],
            },
            payment_collection: {
              fields: ["id"],
              payment_sessions: {
                fields: ["id"],
              },
            },
          },
        })

        const salesChannels = await remoteQuery({
          sales_channel: {
            fields: ["id"],
            carts: {
              fields: ["id"],
            },
          },
        })

        const customers = await remoteQuery({
          customer: {
            fields: ["id"],
            carts: {
              fields: ["id"],
            },
          },
        })

        const regions = await remoteQuery({
          region: {
            fields: ["id"],
            carts: {
              fields: ["id"],
            },
          },
        })

        const paymentCollections = await remoteQuery({
          payment_collection: {
            fields: ["id"],
            cart: {
              fields: ["id"],
            },
          },
        })

        expect(carts).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: cart.id,
              customer: expect.objectContaining({ id: customer.id }),
              sales_channel: expect.objectContaining({ id: salesChannel.id }),
              region: expect.objectContaining({ id: region.id }),
              payment_collection: expect.objectContaining({
                id: paymentCollection.id,
                payment_sessions: expect.arrayContaining([]),
              }),
            }),
          ])
        )

        expect(salesChannels).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: salesChannel.id,
              carts: expect.arrayContaining([
                expect.objectContaining({ id: cart.id }),
              ]),
            }),
          ])
        )

        expect(customers).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: customer.id,
              carts: expect.arrayContaining([
                expect.objectContaining({ id: cart.id }),
              ]),
            }),
          ])
        )

        expect(regions).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: region.id,
              carts: expect.arrayContaining([
                expect.objectContaining({ id: cart.id }),
              ]),
            }),
          ])
        )

        expect(paymentCollections).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: paymentCollection.id,
              cart: expect.objectContaining({ id: cart.id }),
            }),
          ])
        )
      })
    })
  },
})
