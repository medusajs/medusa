import { IPaymentModuleService } from "@medusajs/types"
import { Module, Modules, promiseAll } from "@medusajs/utils"
import { moduleIntegrationTestRunner } from "medusa-test-utils"
import {
  createPaymentCollections,
  createPayments,
  createPaymentSessions,
} from "../../../__fixtures__"
import { PaymentModuleService } from "@services"

jest.setTimeout(30000)

moduleIntegrationTestRunner<IPaymentModuleService>({
  moduleName: Modules.PAYMENT,
  testSuite: ({ MikroOrmWrapper, service }) => {
    describe("Payment Module Service", () => {
      it(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.PAYMENT, {
          service: PaymentModuleService,
        }).linkable

        expect(Object.keys(linkable)).toEqual([
          "payment",
          "paymentCollection",
          "paymentProvider",
        ])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({
          payment: {
            id: {
              linkable: "payment_id",
              primaryKey: "id",
              serviceName: "payment",
              field: "payment",
            },
          },
          paymentCollection: {
            id: {
              linkable: "payment_collection_id",
              primaryKey: "id",
              serviceName: "payment",
              field: "paymentCollection",
            },
          },
          paymentProvider: {
            id: {
              linkable: "payment_provider_id",
              primaryKey: "id",
              serviceName: "payment",
              field: "paymentProvider",
            },
          },
        })
      })

      describe("Payment Flow", () => {
        it("complete payment flow successfully", async () => {
          let paymentCollection = await service.createPaymentCollections({
            currency_code: "usd",
            amount: 200,
            region_id: "reg_123",
          })

          const paymentSession = await service.createPaymentSession(
            paymentCollection.id,
            {
              provider_id: "pp_system_default",
              amount: 200,
              currency_code: "usd",
              data: {},
              context: {
                extra: {},
                customer: {},
                billing_address: {},
                email: "test@test.test.com",
              },
            }
          )

          const payment = await service.authorizePaymentSession(
            paymentSession.id,
            {}
          )

          await service.capturePayment({
            amount: 200,
            payment_id: payment.id,
          })

          await service.completePaymentCollections(paymentCollection.id)

          paymentCollection = await service.retrievePaymentCollection(
            paymentCollection.id,
            { relations: ["payment_sessions", "payments.captures"] }
          )

          expect(paymentCollection).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              currency_code: "usd",
              amount: 200,
              authorized_amount: 200,
              captured_amount: 200,
              status: "authorized",
              region_id: "reg_123",
              deleted_at: null,
              completed_at: expect.any(Date),
              payment_sessions: [
                expect.objectContaining({
                  id: expect.any(String),
                  currency_code: "usd",
                  amount: 200,
                  provider_id: "pp_system_default",
                  status: "authorized",
                  authorized_at: expect.any(Date),
                }),
              ],
              payments: [
                expect.objectContaining({
                  id: expect.any(String),
                  amount: 200,
                  currency_code: "usd",
                  provider_id: "pp_system_default",
                  captures: [
                    expect.objectContaining({
                      amount: 200,
                    }),
                  ],
                }),
              ],
            })
          )
        })
      })

      describe("PaymentCollection", () => {
        beforeEach(async () => {
          const repositoryManager = await MikroOrmWrapper.forkManager()

          await createPaymentCollections(repositoryManager)
          await createPaymentSessions(repositoryManager)
          await createPayments(repositoryManager)
        })

        describe("create", () => {
          it("should throw an error when required params are not passed", async () => {
            let error = await service
              .createPaymentCollections([
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
              .createPaymentCollections([
                {
                  currency_code: "USD",
                  region_id: "req_123",
                } as any,
              ])
              .catch((e) => e)

            // TODO: Change error thrown by Mikro for BigNumber fields
            expect(error.message).toContain(
              "Value for PaymentCollection.amount is required, 'undefined' found"
            )

            error = await service
              .createPaymentCollections([
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
              await service.createPaymentCollections([
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

            await service.deletePaymentCollections("pay-col-id-1")

            collection = await service.listPaymentCollections({
              id: ["pay-col-id-1"],
            })

            expect(collection.length).toEqual(0)
          })
        })

        describe("retrieve", () => {
          it("should retrieve a Payment Collection", async () => {
            let collection = await service.retrievePaymentCollection(
              "pay-col-id-2"
            )

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
            await service.updatePaymentCollections("pay-col-id-2", {
              currency_code: "eur",
              region_id: "reg-2",
            })

            const collection = await service.retrievePaymentCollection(
              "pay-col-id-2"
            )

            expect(collection).toEqual(
              expect.objectContaining({
                id: "pay-col-id-2",
                region_id: "reg-2",
                currency_code: "eur",
              })
            )
          })
        })

        describe("complete", () => {
          it("should complete a Payment Collection", async () => {
            await service.completePaymentCollections("pay-col-id-1")

            const collection = await service.retrievePaymentCollection(
              "pay-col-id-1"
            )

            expect(collection).toEqual(
              expect.objectContaining({
                id: "pay-col-id-1",
                completed_at: expect.any(Date),
              })
            )
          })
        })
      })

      describe("PaymentSession", () => {
        beforeEach(async () => {
          const repositoryManager = await MikroOrmWrapper.forkManager()

          await createPaymentCollections(repositoryManager)
          await createPaymentSessions(repositoryManager)
          await createPayments(repositoryManager)
        })

        describe("create", () => {
          it("should create a payment session successfully", async () => {
            await service.createPaymentSession("pay-col-id-1", {
              provider_id: "pp_system_default",
              amount: 200,
              currency_code: "usd",
              data: {},
              context: {
                extra: {},
                customer: {},
                billing_address: {},
                email: "test@test.test.com",
                resource_id: "cart_test",
              },
            })

            const paymentCollection = await service.retrievePaymentCollection(
              "pay-col-id-1",
              { relations: ["payment_sessions"] }
            )

            expect(paymentCollection).toEqual(
              expect.objectContaining({
                id: "pay-col-id-1",
                status: "not_paid",
                payment_sessions: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.any(String),
                    data: {},
                    status: "pending",
                    authorized_at: null,
                    currency_code: "usd",
                    amount: 200,
                    provider_id: "pp_system_default",
                  }),
                ]),
              })
            )
          })
        })

        describe("update", () => {
          it("should update a payment session successfully", async () => {
            let session = await service.createPaymentSession("pay-col-id-1", {
              provider_id: "pp_system_default",
              amount: 200,
              currency_code: "usd",
              data: {},
              context: {
                extra: {},
                customer: {},
                billing_address: {},
                email: "test@test.test.com",
                resource_id: "cart_test",
              },
            })

            session = await service.updatePaymentSession({
              id: session.id,
              amount: 200,
              currency_code: "eur",
              data: {},
              context: {
                resource_id: "res_id",
                extra: {},
                customer: {},
                billing_address: {},
                email: "new@test.tsst",
              },
            })

            expect(session).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                status: "pending",
                currency_code: "eur",
                amount: 200,
              })
            )
          })
        })

        describe("authorize", () => {
          it("should authorize a payment session", async () => {
            const collection = await service.createPaymentCollections({
              amount: 200,
              region_id: "test-region",
              currency_code: "usd",
            })

            const session = await service.createPaymentSession(collection.id, {
              provider_id: "pp_system_default",
              amount: 100,
              currency_code: "usd",
              data: {},
              context: {
                extra: {},
                resource_id: "test",
                email: "test@test.com",
                billing_address: {},
                customer: {},
              },
            })

            const payment = await service.authorizePaymentSession(
              session.id,
              {}
            )

            expect(payment).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                amount: 100,
                currency_code: "usd",
                provider_id: "pp_system_default",
                refunds: [],
                captures: [],
                data: {},
                cart_id: null,
                order_id: null,
                customer_id: null,
                deleted_at: null,
                captured_at: null,
                canceled_at: null,
                payment_collection_id: expect.any(String),
                payment_session: expect.objectContaining({
                  id: expect.any(String),
                  updated_at: expect.any(Date),
                  created_at: expect.any(Date),
                  currency_code: "usd",
                  amount: 100,
                  raw_amount: { value: "100", precision: 20 },
                  provider_id: "pp_system_default",
                  data: {},
                  status: "authorized",
                  authorized_at: expect.any(Date),
                  payment_collection: expect.objectContaining({
                    id: expect.any(String),
                  }),
                  payment_collection_id: expect.any(String),
                }),
              })
            )
          })
        })
      })

      describe("Payment", () => {
        beforeEach(async () => {
          const repositoryManager = await MikroOrmWrapper.forkManager()

          await createPaymentCollections(repositoryManager)
          await createPaymentSessions(repositoryManager)
          await createPayments(repositoryManager)
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
          it("should capture a payment successfully and update captured_at", async () => {
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
                captured_at: expect.any(Date),
              })
            )
          })

          it("should split a payment in two captures a payment successfully", async () => {
            await service.capturePayment({
              amount: 50,
              payment_id: "pay-id-1",
            })

            const capturedPayment = await service.capturePayment({
              amount: 50,
              payment_id: "pay-id-1",
            })

            expect(capturedPayment).toEqual(
              expect.objectContaining({
                id: "pay-id-1",
                amount: 100,

                captures: [
                  expect.objectContaining({
                    created_by: null,
                    amount: 50,
                  }),
                  expect.objectContaining({
                    created_by: null,
                    amount: 50,
                  }),
                ],
              })
            )
          })

          it("should fail to capture amount greater than authorized", async () => {
            const error = await service
              .capturePayment({
                amount: 200,
                payment_id: "pay-id-1",
              })
              .catch((e) => e)

            expect(error.message).toEqual(
              "You cannot capture more than the authorized amount substracted by what is already captured."
            )
          })

          it("should fail to capture amount greater than what is already captured", async () => {
            await service.capturePayment({
              amount: 99,
              payment_id: "pay-id-1",
            })

            const error = await service
              .capturePayment({
                amount: 2,
                payment_id: "pay-id-1",
              })
              .catch((e) => e)

            expect(error.message).toEqual(
              "You cannot capture more than the authorized amount substracted by what is already captured."
            )
          })

          it("should fail to capture already captured payment", async () => {
            await service.capturePayment({
              amount: 100,
              payment_id: "pay-id-1",
            })

            const error = await service
              .capturePayment({
                amount: 100,
                payment_id: "pay-id-1",
              })
              .catch((e) => e)

            expect(error.message).toEqual(
              "You cannot capture more than the authorized amount substracted by what is already captured."
            )
          })

          it("should fail to capture a canceled payment", async () => {
            await service.cancelPayment("pay-id-1")

            const error = await service
              .capturePayment({
                amount: 100,
                payment_id: "pay-id-1",
              })
              .catch((e) => e)

            expect(error.message).toEqual(
              "The payment: pay-id-1 has been canceled."
            )
          })
        })

        describe("refund", () => {
          it("should refund a payments successfully", async () => {
            await service.capturePayment({
              amount: 100,
              payment_id: "pay-id-2",
            })

            const refundedPayment = await service.refundPayment({
              amount: 100,
              payment_id: "pay-id-2",
            })

            expect(refundedPayment).toEqual(
              expect.objectContaining({
                id: "pay-id-2",
                amount: 100,
                refunds: [
                  expect.objectContaining({
                    created_by: null,
                    amount: 100,
                  }),
                ],
              })
            )
          })

          it("should throw if refund is greater than captured amount", async () => {
            await service.capturePayment({
              amount: 50,
              payment_id: "pay-id-1",
            })

            const error = await service
              .refundPayment({
                amount: 100,
                payment_id: "pay-id-1",
              })
              .catch((e) => e)

            expect(error.message).toEqual(
              "You cannot refund more than what is captured on the payment."
            )
          })
        })

        describe("cancel", () => {
          it("should cancel a payment", async () => {
            const payment = await service.cancelPayment("pay-id-2")

            expect(payment).toEqual(
              expect.objectContaining({
                id: "pay-id-2",
                canceled_at: expect.any(Date),
              })
            )
          })

          // TODO: revisit when totals are implemented
          // it("should throw if trying to cancel a captured payment", async () => {
          //   await service.capturePayment({ payment_id: "pay-id-2", amount: 100 })
          //
          //   const error = await service
          //     .cancelPayment("pay-id-2")
          //     .catch((e) => e.message)
          //
          //   expect(error).toEqual(
          //     "Cannot cancel a payment: pay-id-2 that has been captured."
          //   )
          // })
        })

        describe("concurrency", () => {
          it("should authorize, capture and refund multiple payment sessions", async () => {
            const collection = await service.createPaymentCollections({
              amount: 500,
              region_id: "test-region",
              currency_code: "usd",
            })

            const session1 = await service.createPaymentSession(collection.id, {
              provider_id: "pp_system_default",
              amount: 120,
              currency_code: "usd",
              data: {},
            })

            const session2 = await service.createPaymentSession(collection.id, {
              provider_id: "pp_system_default",
              amount: 180,
              currency_code: "usd",
              data: {},
            })

            const session3 = await service.createPaymentSession(collection.id, {
              provider_id: "pp_system_default",
              amount: 200,
              currency_code: "usd",
              data: {},
            })

            const session4 = await service.createPaymentSession(collection.id, {
              provider_id: "pp_system_default",
              amount: 500,
              currency_code: "eur",
              data: {},
            })

            // authorize
            const [payment1, payment2, payment3, payment4] = await promiseAll([
              service.authorizePaymentSession(session1.id, {}),
              service.authorizePaymentSession(session2.id, {}),
              service.authorizePaymentSession(session3.id, {}),
              service.authorizePaymentSession(session4.id, {}),
            ])

            // capture
            await promiseAll([
              service.capturePayment({
                amount: 60,
                payment_id: payment1.id,
              }),
              service.capturePayment({
                amount: 60,
                payment_id: payment1.id,
              }),
              service.capturePayment({
                amount: 180,
                payment_id: payment2.id,
              }),
              service.capturePayment({
                amount: 100,
                payment_id: payment3.id,
              }),
              service.capturePayment({
                amount: 40,
                payment_id: payment3.id,
              }),
              service.capturePayment({
                amount: 60,
                payment_id: payment3.id,
              }),
              service.capturePayment({
                amount: 200,
                payment_id: payment4.id,
              }),
              service.capturePayment({
                amount: 200,
                payment_id: payment4.id,
              }),
              service.capturePayment({
                amount: 100,
                payment_id: payment4.id,
              }),
            ])

            // refund
            await promiseAll([
              service.refundPayment({
                amount: 70,
                payment_id: payment1.id,
              }),
              service.refundPayment({
                amount: 50,
                payment_id: payment1.id,
              }),
              service.refundPayment({
                amount: 180,
                payment_id: payment2.id,
              }),
              service.refundPayment({
                amount: 100,
                payment_id: payment3.id,
              }),
              service.refundPayment({
                amount: 40,
                payment_id: payment3.id,
              }),
              service.refundPayment({
                amount: 60,
                payment_id: payment3.id,
              }),
              service.refundPayment({
                amount: 400,
                payment_id: payment4.id,
              }),
              service.refundPayment({
                amount: 99,
                payment_id: payment4.id,
              }),
            ])

            expect(payment1).toEqual(
              expect.objectContaining({
                amount: 120,
                currency_code: "usd",
                provider_id: "pp_system_default",
                payment_session: expect.objectContaining({
                  currency_code: "usd",
                  amount: 120,
                  raw_amount: { value: "120", precision: 20 },
                  provider_id: "pp_system_default",
                  status: "authorized",
                  authorized_at: expect.any(Date),
                }),
              })
            )

            expect(payment2).toEqual(
              expect.objectContaining({
                amount: 180,
                currency_code: "usd",
                provider_id: "pp_system_default",
                payment_session: expect.objectContaining({
                  currency_code: "usd",
                  amount: 180,
                  raw_amount: { value: "180", precision: 20 },
                  provider_id: "pp_system_default",
                  status: "authorized",
                  authorized_at: expect.any(Date),
                }),
              })
            )

            expect(payment3).toEqual(
              expect.objectContaining({
                amount: 200,
                currency_code: "usd",
                provider_id: "pp_system_default",
                payment_session: expect.objectContaining({
                  currency_code: "usd",
                  amount: 200,
                  raw_amount: { value: "200", precision: 20 },
                  provider_id: "pp_system_default",
                  status: "authorized",
                  authorized_at: expect.any(Date),
                }),
              })
            )

            expect(payment4).toEqual(
              expect.objectContaining({
                amount: 500,
                currency_code: "eur",
                provider_id: "pp_system_default",
                payment_session: expect.objectContaining({
                  currency_code: "eur",
                  amount: 500,
                  raw_amount: { value: "500", precision: 20 },
                  provider_id: "pp_system_default",
                  status: "authorized",
                  authorized_at: expect.any(Date),
                }),
              })
            )

            const finalCollection = (
              await service.listPaymentCollections({
                id: collection.id,
              })
            )[0]

            expect(finalCollection).toEqual(
              expect.objectContaining({
                status: "authorized",
                amount: 500,
                authorized_amount: 1000,
                captured_amount: 1000,
                refunded_amount: 999,
              })
            )
          })
        })
      })
    })
  },
})
