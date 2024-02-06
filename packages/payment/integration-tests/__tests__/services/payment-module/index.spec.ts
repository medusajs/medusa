import { IPaymentModuleService } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"

import { initialize } from "../../../../src"
import { DB_URL, MikroOrmWrapper } from "../../../utils"
import {
  createPaymentCollections,
  createPaymentSessions,
  createPayments,
} from "../../../__fixtures__"
import { getInitModuleConfig } from "../../../utils/get-init-module-config"
import { initModules } from "medusa-test-utils"
import { Modules } from "@medusajs/modules-sdk"

jest.setTimeout(30000)

describe("Payment Module Service", () => {
  let service: IPaymentModuleService

  describe("PaymentCollection", () => {
    let repositoryManager: SqlEntityManager
    let shutdownFunc: () => Promise<void>

    beforeAll(async () => {
      const initModulesConfig = getInitModuleConfig()

      const { medusaApp, shutdown } = await initModules(initModulesConfig)

      service = medusaApp.modules[Modules.PAYMENT]

      shutdownFunc = shutdown
    })

    afterAll(async () => {
      await shutdownFunc()
    })

    beforeEach(async () => {
      await MikroOrmWrapper.setupDatabase()
      repositoryManager = await MikroOrmWrapper.forkManager()

      service = await initialize({
        database: {
          clientUrl: DB_URL,
          schema: process.env.MEDUSA_PAYMNET_DB_SCHEMA,
        },
      })

      await createPaymentCollections(repositoryManager)
      await createPaymentSessions(repositoryManager)
      await createPayments(repositoryManager)
    })

    afterEach(async () => {
      await MikroOrmWrapper.clearDatabase()
    })

    describe("create", () => {
      it("should throw an error when required params are not passed", async () => {
        let error = await service
          .createPaymentCollection([
            {
              amount: 200,
              region_id: "req_123",
            } as any,
          ])
          .catch((e) => e)

        expect(error.message).toContain(
          "Value for PaymentCollection.currency_code is required, 'undefined' found"
        )

        error = await service
          .createPaymentCollection([
            {
              currency_code: "USD",
              region_id: "req_123",
            } as any,
          ])
          .catch((e) => e)

        expect(error.message).toContain(
          "Value for PaymentCollection.amount is required, 'undefined' found"
        )

        error = await service
          .createPaymentCollection([
            {
              currency_code: "USD",
              amount: 200,
            } as any,
          ])
          .catch((e) => e)

        expect(error.message).toContain(
          "Value for PaymentCollection.region_id is required, 'undefined' found"
        )
      })

      it("should create a payment collection successfully", async () => {
        const [createdPaymentCollection] =
          await service.createPaymentCollection([
            { currency_code: "USD", amount: 200, region_id: "reg_123" },
          ])

        expect(createdPaymentCollection).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            status: "not_paid",
            payment_providers: [],
            payment_sessions: [],
            payments: [],
            currency_code: "USD",
            amount: 200,
          })
        )
      })
    })

    describe("delete", () => {
      it("should delete a Payment Collection", async () => {
        let collection = await service.listPaymentCollections({
          id: ["pay-col-id-1"],
        })

        expect(collection.length).toEqual(1)

        await service.deletePaymentCollections(["pay-col-id-1"])

        collection = await service.listPaymentCollections({
          id: ["pay-col-id-1"],
        })

        expect(collection.length).toEqual(0)
      })
    })

    describe("retrieve", () => {
      it("should retrieve a Payment Collection", async () => {
        let collection = await service.retrievePaymentCollection("pay-col-id-2")

        expect(collection).toEqual(
          expect.objectContaining({
            id: "pay-col-id-2",
            amount: 200,
            region_id: "region-id-1",
            currency_code: "usd",
          })
        )
      })

      it("should fail to retrieve a non existent Payment Collection", async () => {
        let error = await service
          .retrievePaymentCollection("pay-col-id-not-exists")
          .catch((e) => e)

        expect(error.message).toContain(
          "PaymentCollection with id: pay-col-id-not-exists was not found"
        )
      })
    })

    describe("list", () => {
      it("should list and count Payment Collection", async () => {
        let [collections, count] =
          await service.listAndCountPaymentCollections()

        expect(count).toEqual(3)

        expect(collections).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: "pay-col-id-1",
              amount: 100,
              region_id: "region-id-1",
              currency_code: "usd",
            }),
            expect.objectContaining({
              id: "pay-col-id-2",
              amount: 200,
              region_id: "region-id-1",
              currency_code: "usd",
            }),
            expect.objectContaining({
              id: "pay-col-id-3",
              amount: 300,
              region_id: "region-id-2",
              currency_code: "usd",
            }),
          ])
        )
      })

      it("should list Payment Collections by region_id", async () => {
        let collections = await service.listPaymentCollections(
          {
            region_id: "region-id-1",
          },
          { select: ["id", "amount", "region_id"] }
        )

        expect(collections.length).toEqual(2)

        expect(collections).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: "pay-col-id-1",
              amount: 100,
              region_id: "region-id-1",
            }),
            expect.objectContaining({
              id: "pay-col-id-2",
              amount: 200,
              region_id: "region-id-1",
            }),
          ])
        )
      })
    })

    describe("update", () => {
      it("should update a Payment Collection", async () => {
        await service.updatePaymentCollection({
          id: "pay-col-id-2",
          currency_code: "eur",
          authorized_amount: 200,
        })

        const collection = await service.retrievePaymentCollection(
          "pay-col-id-2"
        )

        expect(collection).toEqual(
          expect.objectContaining({
            id: "pay-col-id-2",
            authorized_amount: 200,
            currency_code: "eur",
          })
        )
      })
    })
  })

  describe("PaymentSession", () => {
    let repositoryManager: SqlEntityManager

    beforeEach(async () => {
      await MikroOrmWrapper.setupDatabase()
      repositoryManager = await MikroOrmWrapper.forkManager()

      service = await initialize({
        database: {
          clientUrl: DB_URL,
          schema: process.env.MEDUSA_PAYMNET_DB_SCHEMA,
        },
      })

      await createPaymentCollections(repositoryManager)
      await createPaymentSessions(repositoryManager)
    })

    afterEach(async () => {
      await MikroOrmWrapper.clearDatabase()
    })

    describe("create", () => {
      it("should create a payment session successfully", async () => {
        const paymentCollection = await service.createPaymentSession(
          "pay-col-id-1",
          {
            amount: 200,
            provider_id: "manual",
            currency_code: "usd",
          }
        )

        expect(paymentCollection).toEqual(
          expect.objectContaining({
            id: "pay-col-id-1",
            status: "not_paid",
            payment_sessions: expect.arrayContaining([
              {
                id: expect.any(String),
                data: null,
                status: "pending",
                authorized_at: null,
                currency_code: "usd",
                amount: 200,
                provider_id: "manual",
                payment_collection: expect.objectContaining({
                  id: paymentCollection.id,
                }),
              },
            ]),
          })
        )
      })
    })
  })

  describe("Payment", () => {
    let repositoryManager: SqlEntityManager

    beforeEach(async () => {
      await MikroOrmWrapper.setupDatabase()
      repositoryManager = await MikroOrmWrapper.forkManager()

      service = await initialize({
        database: {
          clientUrl: DB_URL,
          schema: process.env.MEDUSA_PAYMNET_DB_SCHEMA,
        },
      })

      await createPaymentCollections(repositoryManager)
      await createPaymentSessions(repositoryManager)
      await createPayments(repositoryManager)
    })

    afterEach(async () => {
      await MikroOrmWrapper.clearDatabase()
    })

    describe("create", () => {
      it("should create a payment successfully", async () => {
        let paymentCollection = await service.createPaymentCollection({
          currency_code: "usd",
          amount: 200,
          region_id: "reg",
        })

        paymentCollection = await service.createPaymentSession(
          paymentCollection.id,
          {
            amount: 200,
            provider_id: "manual",
            currency_code: "usd",
          }
        )

        const createdPayment = await service.createPayment({
          data: {},
          amount: 200,
          provider_id: "manual",
          currency_code: "usd",
          payment_collection_id: paymentCollection.id,
          payment_session_id: paymentCollection.payment_sessions![0].id,
        })

        expect(createdPayment).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            authorized_amount: null,
            cart_id: null,
            order_id: null,
            order_edit_id: null,
            customer_id: null,
            data: {},
            deleted_at: null,
            captured_at: null,
            canceled_at: null,
            refunds: [],
            captures: [],
            amount: 200,
            currency_code: "usd",
            provider_id: "manual",
            payment_collection: expect.objectContaining({
              id: paymentCollection.id,
            }),
            payment_session: expect.objectContaining({
              id: paymentCollection.payment_sessions![0].id,
            }),
          })
        )
      })
    })

    describe("update", () => {
      it("should update a payment successfully", async () => {
        const updatedPayment = await service.updatePayment({
          id: "pay-id-1",
          cart_id: "new-cart",
        })

        expect(updatedPayment).toEqual(
          expect.objectContaining({
            id: "pay-id-1",
            cart_id: "new-cart",
          })
        )
      })
    })

    describe("capture", () => {
      it("should capture a payment successfully", async () => {
        const capturedPayment = await service.capturePayment({
          amount: 100,
          payment_id: "pay-id-1",
        })

        expect(capturedPayment).toEqual(
          expect.objectContaining({
            id: "pay-id-1",
            amount: 100,

            captures: [
              expect.objectContaining({
                created_by: null,
                amount: 100,
              }),
            ],

            // TODO: uncomment when totals calculations are implemented
            // captured_amount: 100,
            // captured_at: expect.any(Date),
          })
        )
      })

      it("should capture payments in bulk successfully", async () => {
        const capturedPayments = await service.capturePayment([
          {
            amount: 50, // partially captured
            payment_id: "pay-id-1",
          },
          {
            amount: 100, // fully captured
            payment_id: "pay-id-2",
          },
        ])

        expect(capturedPayments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: "pay-id-1",
              amount: 100,
              authorized_amount: 100,
              captured_at: null,
              captures: [
                expect.objectContaining({
                  created_by: null,
                  amount: 50,
                }),
              ],
              // captured_amount: 50,
            }),
            expect.objectContaining({
              id: "pay-id-2",
              amount: 100,
              authorized_amount: 100,
              // captured_at: expect.any(Date),
              captures: [
                expect.objectContaining({
                  created_by: null,
                  amount: 100,
                }),
              ],
              // captured_amount: 100,
            }),
          ])
        )
      })

      // TODO: uncomment when totals are implemented
      // it("should fail to capture payments in bulk if one of the captures fail", async () => {
      //   const error = await service
      //     .capturePayment([
      //       {
      //         amount: 50,
      //         payment_id: "pay-id-1",
      //       },
      //       {
      //         amount: 200, // exceeds authorized amount
      //         payment_id: "pay-id-2",
      //       },
      //     ])
      //     .catch((e) => e)
      //
      //   expect(error.message).toEqual(
      //     "Total captured amount for payment: pay-id-2 exceeds authorized amount."
      //   )
      // })

      // it("should fail to capture amount greater than authorized", async () => {
      //   const error = await service
      //     .capturePayment({
      //       amount: 200,
      //       payment_id: "pay-id-1",
      //     })
      //     .catch((e) => e)
      //
      //   expect(error.message).toEqual(
      //     "Total captured amount for payment: pay-id-1 exceeds authorized amount."
      //   )
      // })

      //   it("should fail to capture already captured payment", async () => {
      //     await service.capturePayment({
      //       amount: 100,
      //       payment_id: "pay-id-1",
      //     })
      //
      //     const error = await service
      //       .capturePayment({
      //         amount: 100,
      //         payment_id: "pay-id-1",
      //       })
      //       .catch((e) => e)
      //
      //     expect(error.message).toEqual("The payment is already fully captured.")
      //   })
    })

    describe("refund", () => {
      it("should refund a payments in bulk successfully", async () => {
        await service.capturePayment({
          amount: 100,
          payment_id: "pay-id-1",
        })

        await service.capturePayment({
          amount: 100,
          payment_id: "pay-id-2",
        })

        const refundedPayment = await service.refundPayment([
          {
            amount: 100,
            payment_id: "pay-id-1",
          },
          {
            amount: 100,
            payment_id: "pay-id-2",
          },
        ])

        expect(refundedPayment).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: "pay-id-1",
              amount: 100,
              refunds: [
                expect.objectContaining({
                  created_by: null,
                  amount: 100,
                }),
              ],
              // captured_amount: 100,
              // refunded_amount: 100,
            }),
            expect.objectContaining({
              id: "pay-id-2",
              amount: 100,
              refunds: [
                expect.objectContaining({
                  created_by: null,
                  amount: 100,
                }),
              ],
              // captured_amount: 100,
              // refunded_amount: 100,
            }),
          ])
        )
      })

      // it("should throw if refund is greater than captured amount", async () => {
      //   await service.capturePayment({
      //     amount: 50,
      //     payment_id: "pay-id-1",
      //   })
      //
      //   const error = await service
      //     .refundPayment({
      //       amount: 100,
      //       payment_id: "pay-id-1",
      //     })
      //     .catch((e) => e)
      //
      //   expect(error.message).toEqual(
      //     "Refund amount for payment: pay-id-1 cannot be greater than the amount captured on the payment."
      //   )
      // })
    })
  })
})
