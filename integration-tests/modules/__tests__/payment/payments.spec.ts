import {
  capturePaymentWorkflow,
  refundPaymentWorkflow,
} from "@medusajs/core-flows"
import {
  LinkModuleUtils,
  ModuleRegistrationName,
  Modules,
} from "@medusajs/modules-sdk"
import { IPaymentModuleService, IRegionModuleService } from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils/dist"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Payments", () => {
      let appContainer
      let regionService: IRegionModuleService
      let paymentService: IPaymentModuleService
      let remoteLink

      beforeAll(async () => {
        appContainer = getContainer()
        regionService = appContainer.resolve(ModuleRegistrationName.REGION)
        paymentService = appContainer.resolve(ModuleRegistrationName.PAYMENT)
        remoteLink = appContainer.resolve(LinkModuleUtils.REMOTE_LINK)
      })

      // TODO: Test should move to `integration-tests/api`
      it("should list payment providers", async () => {
        const region = await regionService.create({
          name: "Test Region",
          currency_code: "usd",
        })

        let response = await api.get(
          `/store/regions/${region.id}?fields=*payment_providers`
        )

        expect(response.status).toEqual(200)
        expect(response.data.region.payment_providers).toEqual([])

        await remoteLink.create([
          {
            [Modules.REGION]: {
              region_id: region.id,
            },
            [Modules.PAYMENT]: {
              payment_provider_id: "pp_system_default",
            },
          },
        ])

        response = await api.get(
          `/store/regions/${region.id}?fields=*payment_providers`
        )

        expect(response.status).toEqual(200)
        expect(response.data.region.payment_providers).toEqual([
          expect.objectContaining({
            id: "pp_system_default",
          }),
        ])
      })

      it("should capture a payment", async () => {
        const paymentCollection = await paymentService.createPaymentCollections(
          {
            region_id: "test-region",
            amount: 1000,
            currency_code: "usd",
          }
        )

        const paymentSession = await paymentService.createPaymentSession(
          paymentCollection.id,
          {
            provider_id: "pp_system_default",
            amount: 1000,
            currency_code: "usd",
            data: {},
          }
        )

        const payment = await paymentService.authorizePaymentSession(
          paymentSession.id,
          {}
        )

        await capturePaymentWorkflow(appContainer).run({
          input: {
            payment_id: payment.id,
          },
          throwOnError: false,
        })

        const [paymentResult] = await paymentService.listPayments({
          id: payment.id,
        })

        expect(paymentResult).toEqual(
          expect.objectContaining({
            id: payment.id,
            amount: 1000,
            payment_collection_id: paymentCollection.id,
          })
        )

        const [capture] = await paymentService.listCaptures({
          payment_id: payment.id,
        })

        expect(capture).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            payment: expect.objectContaining({ id: payment.id }),
            amount: 1000,
          })
        )
      })

      it("should partially capture a payment", async () => {
        const paymentCollection = await paymentService.createPaymentCollections(
          {
            region_id: "test-region",
            amount: 1000,
            currency_code: "usd",
          }
        )

        const paymentSession = await paymentService.createPaymentSession(
          paymentCollection.id,
          {
            provider_id: "pp_system_default",
            amount: 1000,
            currency_code: "usd",
            data: {},
          }
        )

        const payment = await paymentService.authorizePaymentSession(
          paymentSession.id,
          {}
        )

        await capturePaymentWorkflow(appContainer).run({
          input: {
            payment_id: payment.id,
            amount: 500,
          },
          throwOnError: false,
        })

        const [paymentResult] = await paymentService.listPayments({
          id: payment.id,
        })

        expect(paymentResult).toEqual(
          expect.objectContaining({
            id: payment.id,
            amount: 1000,
            payment_collection_id: paymentCollection.id,
          })
        )

        const [capture] = await paymentService.listCaptures({
          payment_id: payment.id,
        })

        expect(capture).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            payment: expect.objectContaining({ id: payment.id }),
            amount: 500,
          })
        )
      })

      it("should refund a payment", async () => {
        const paymentCollection = await paymentService.createPaymentCollections(
          {
            region_id: "test-region",
            amount: 1000,
            currency_code: "usd",
          }
        )

        const paymentSession = await paymentService.createPaymentSession(
          paymentCollection.id,
          {
            provider_id: "pp_system_default",
            amount: 1000,
            currency_code: "usd",
            data: {},
          }
        )

        const payment = await paymentService.authorizePaymentSession(
          paymentSession.id,
          {}
        )

        await capturePaymentWorkflow(appContainer).run({
          input: {
            payment_id: payment.id,
          },
          throwOnError: false,
        })

        await refundPaymentWorkflow(appContainer).run({
          input: {
            payment_id: payment.id,
          },
          throwOnError: false,
        })

        const [refund] = await paymentService.listRefunds({
          payment_id: payment.id,
        })

        expect(refund).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            payment: expect.objectContaining({ id: payment.id }),
            amount: 1000,
          })
        )
      })

      it("should partially refund a payment", async () => {
        const paymentCollection = await paymentService.createPaymentCollections(
          {
            region_id: "test-region",
            amount: 1000,
            currency_code: "usd",
          }
        )

        const paymentSession = await paymentService.createPaymentSession(
          paymentCollection.id,
          {
            provider_id: "pp_system_default",
            amount: 1000,
            currency_code: "usd",
            data: {},
          }
        )

        const payment = await paymentService.authorizePaymentSession(
          paymentSession.id,
          {}
        )

        await capturePaymentWorkflow(appContainer).run({
          input: {
            payment_id: payment.id,
          },
          throwOnError: false,
        })

        await refundPaymentWorkflow(appContainer).run({
          input: {
            payment_id: payment.id,
            amount: 500,
          },
          throwOnError: false,
        })

        const [refund] = await paymentService.listRefunds({
          payment_id: payment.id,
        })

        expect(refund).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            payment: expect.objectContaining({ id: payment.id }),
            amount: 500,
          })
        )
      })
    })
  },
})
