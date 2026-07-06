import { IPaymentModuleService } from "@medusajs/framework/types"

import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules } from "@medusajs/framework/utils"

jest.setTimeout(30000)

moduleIntegrationTestRunner<IPaymentModuleService>({
  moduleName: Modules.PAYMENT,
  moduleOptions: {
    cloud: {
      api_key: "test",
      environment_handle: "test",
      webhook_secret: "test",
      endpoint: "test",
    },
  },
  testSuite: ({ service }) => {
    describe("Payment Module Service", () => {
      describe("providers", () => {
        it("should load the system and medusa payments providers by default", async () => {
          const paymentProviders = await service.listPaymentProviders()

          expect(paymentProviders).toHaveLength(2)
          expect(paymentProviders).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "pp_system_default",
              }),
              expect.objectContaining({
                id: "pp_medusa-payments_default",
              }),
            ])
          )
        })

        it("should create a payment session successfully", async () => {
          const paymentCollection = await service.createPaymentCollections({
            currency_code: "USD",
            amount: 200,
          })

          const paymentSession = await service.createPaymentSession(
            paymentCollection.id,
            {
              provider_id: "pp_system_default",
              amount: 200,
              currency_code: "USD",
              data: {},
            }
          )
        })

        it("should load payment plugins", async () => {
          let error = await service
            .createPaymentCollections([
              {
                amount: 200,
              } as any,
            ])
            .catch((e) => e)

          expect(error.message).toContain(
            "Value for PaymentCollection.currency_code is required, 'undefined' found"
          )
        })

        it("should create a payment collection successfully", async () => {
          const [createdPaymentCollection] =
            await service.createPaymentCollections([
              { currency_code: "USD", amount: 200 },
            ])

          expect(createdPaymentCollection).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              status: "not_paid",
              payment_providers: [],
              payment_sessions: [],
              payments: [],
              currency_code: "usd",
              amount: 200,
            })
          )
        })
      })
    })
  },
})

moduleIntegrationTestRunner<IPaymentModuleService>({
  moduleName: Modules.PAYMENT,
  moduleOptions: {},
  testSuite: ({ service }) =>
    describe("providers", () => {
      it("should not load the medusa payments provider if the cloud options are not provided", async () => {
        const paymentProviders = await service.listPaymentProviders()
        expect(paymentProviders).toHaveLength(1)
        expect(paymentProviders[0].id).toBe("pp_system_default")
      })
    }),
})
