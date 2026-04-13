import { IPaymentModuleService } from "@medusajs/framework/types"
import { Module, Modules, promiseAll } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { PaymentModuleService } from "@services"
import {
  createPaymentCollections,
  createPayments,
  createPaymentSessions,
} from "../../../__fixtures__"

jest.setTimeout(30000)

moduleIntegrationTestRunner<IPaymentModuleService>({
  moduleName: Modules.PAYMENT,
  testSuite: ({ MikroOrmWrapper, service }) => {
    describe("Payment Module Service", () => {
      beforeEach(() => {
        jest.clearAllMocks()
      })

      it(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.PAYMENT, {
          service: PaymentModuleService,
        }).linkable

        expect(Object.keys(linkable)).toHaveLength(8)
        expect(Object.keys(linkable)).toEqual([
          "paymentCollection",
          "paymentSession",
          "payment",
          "capture",
          "refund",
          "refundReason",
          "accountHolder",
          "paymentProvider",
        ])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({
          paymentCollection: {
            id: {
              linkable: "payment_collection_id",
              primaryKey: "id",
              serviceName: "payment",
              field: "paymentCollection",
              entity: "PaymentCollection",
            },
          },
          paymentSession: {
            id: {
              linkable: "payment_session_id",
              primaryKey: "id",
              serviceName: "payment",
              field: "paymentSession",
              entity: "PaymentSession",
            },
          },
          payment: {
            id: {
              linkable: "payment_id",
              primaryKey: "id",
              serviceName: "payment",
              field: "payment",
              entity: "Payment",
            },
          },
          capture: {
            id: {
              linkable: "capture_id",
              primaryKey: "id",
              serviceName: "payment",
              field: "capture",
              entity: "Capture",
            },
          },
          refund: {
            id: {
              linkable: "refund_id",
              primaryKey: "id",
              serviceName: "payment",
              field: "refund",
              entity: "Refund",
            },
          },
          refundReason: {
            id: {
              linkable: "refund_reason_id",
              primaryKey: "id",
              serviceName: "payment",
              field: "refundReason",
              entity: "RefundReason",
            },
          },
          accountHolder: {
            id: {
              linkable: "account_holder_id",
              primaryKey: "id",
              serviceName: "payment",
              field: "accountHolder",
              entity: "AccountHolder",
            },
          },
          paymentProvider: {
            id: {
              linkable: "payment_provider_id",
              primaryKey: "id",
              serviceName: "payment",
              field: "paymentProvider",
              entity: "PaymentProvider",
            },
          },
        })
      })

      describe("Payment Flow", () => {
        it("complete payment flow successfully", async () => {
          let paymentCollection = await service.createPaymentCollections({
            currency_code: "usd",
            amount: 200,
          })

          const paymentSession = await service.createPaymentSession(
            paymentCollection.id,
            {
              provider_id: "pp_system_default",
              amount: 200,
              currency_code: "usd",
              data: {},
              context: {
                customer: { id: "cus-id-1", email: "new@test.tsst" },
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
              status: "completed",
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

        it("complete payment flow successfully when rounded numbers are equal", async () => {
          let paymentCollection = await service.createPaymentCollections({
            currency_code: "usd",
            amount: 200.129,
          })

          const paymentSession = await service.createPaymentSession(
            paymentCollection.id,
            {
              provider_id: "pp_system_default",
              amount: 200.129,
              currency_code: "usd",
              data: {},
              context: {
                customer: { id: "cus-id-1", email: "new@test.tsst" },
              },
            }
          )

          const payment = await service.authorizePaymentSession(
            paymentSession.id,
            {}
          )

          await service.capturePayment({
            amount: 200.13, // rounded from payment provider
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
              amount: 200.129,
              authorized_amount: 200.129,
              captured_amount: 200.13,
              status: "completed",
              deleted_at: null,
              completed_at: expect.any(Date),
              payment_sessions: [
                expect.objectContaining({
                  id: expect.any(String),
                  currency_code: "usd",
                  amount: 200.129,
                  provider_id: "pp_system_default",
                  status: "authorized",
                  authorized_at: expect.any(Date),
                }),
              ],
              payments: [
                expect.objectContaining({
                  id: expect.any(String),
                  amount: 200.129,
                  currency_code: "usd",
                  provider_id: "pp_system_default",
                  captures: [
                    expect.objectContaining({
                      amount: 200.13,
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
                } as any,
              ])
              .catch((e) => e)

            // TODO: Change error thrown by Mikro for BigNumber fields
            expect(error.message).toContain(
              "Value for PaymentCollection.amount is required, 'undefined' found"
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
                  currency_code: "usd",
                }),
                expect.objectContaining({
                  id: "pay-col-id-2",
                  amount: 200,
                  currency_code: "usd",
                }),
                expect.objectContaining({
                  id: "pay-col-id-3",
                  amount: 300,
                  currency_code: "usd",
                }),
              ])
            )
          })
        })

        describe("update", () => {
          it("should update a Payment Collection", async () => {
            await service.updatePaymentCollections("pay-col-id-2", {
              currency_code: "eur",
            })

            const collection = await service.retrievePaymentCollection(
              "pay-col-id-2"
            )

            expect(collection).toEqual(
              expect.objectContaining({
                id: "pay-col-id-2",
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
                customer: {
                  id: "cus-id-1",
                  email: "test@test.test.com",
                },
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

          it("should gracefully handle payment session creation fails from external provider", async () => {
            jest
              .spyOn((service as any).paymentProviderService_, "createSession")
              .mockImplementationOnce(() => {
                throw new Error("Create session error")
              })

            const deleteProviderSessionMock = jest.spyOn(
              (service as any).paymentProviderService_,
              "deleteSession"
            )

            const deletePaymentSessionMock = jest.spyOn(
              (service as any).paymentSessionService_,
              "delete"
            )

            const error = await service
              .createPaymentSession("pay-col-id-1", {
                provider_id: "pp_system_default",
                amount: 200,
                currency_code: "usd",
                data: {},
                context: {
                  customer: { id: "cus-id-1", email: "test@test.test.com" },
                },
              })
              .catch((e) => e)

            expect(deleteProviderSessionMock).toHaveBeenCalledTimes(0)
            expect(deletePaymentSessionMock).toHaveBeenCalledTimes(1)
            expect(error.message).toEqual("Create session error")
          })

          it("should gracefully handle payment session creation fails from internal failure", async () => {
            jest
              .spyOn((service as any).paymentSessionService_, "update")
              .mockImplementationOnce(() => {
                throw new Error("Update session error")
              })

            const deleteProviderSessionMock = jest.spyOn(
              (service as any).paymentProviderService_,
              "deleteSession"
            )

            const deletePaymentSessionMock = jest.spyOn(
              (service as any).paymentSessionService_,
              "delete"
            )

            const error = await service
              .createPaymentSession("pay-col-id-1", {
                provider_id: "pp_system_default",
                amount: 200,
                currency_code: "usd",
                data: {},
                context: {
                  customer: { id: "cus-id-1", email: "test@test.test.com" },
                },
              })
              .catch((e) => e)

            expect(deleteProviderSessionMock).toHaveBeenCalledTimes(1)
            expect(deletePaymentSessionMock).toHaveBeenCalledTimes(1)
            expect(error.message).toEqual("Update session error")
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
                customer: { id: "cus-id-1", email: "new@test.tsst" },
              },
            })

            session = await service.updatePaymentSession({
              id: session.id,
              amount: 200,
              currency_code: "eur",
              data: {},
              context: {
                customer: { id: "cus-id-1", email: "new@test.tsst" },
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
              currency_code: "usd",
            })

            const session = await service.createPaymentSession(collection.id, {
              provider_id: "pp_system_default",
              amount: 100,
              currency_code: "usd",
              data: {},
              context: {
                customer: { id: "cus-id-1", email: "new@test.tsst" },
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
                  payment_collection_id: expect.any(String),
                }),
              })
            )
          })

          it("should auto capture payment when provider returns captured status", async () => {
            const collection = await service.createPaymentCollections({
              amount: 200,
              currency_code: "usd",
            })

            const session = await service.createPaymentSession(collection.id, {
              provider_id: "pp_system_default",
              amount: 100,
              currency_code: "usd",
              data: {},
              context: {
                customer: { id: "cus-id-1", email: "new@test.tsst" },
              },
            })

            // Mock the provider to return CAPTURED status
            const authorizePaymentMock = jest
              .spyOn(
                (service as any).paymentProviderService_,
                "authorizePayment"
              )
              .mockResolvedValueOnce({
                data: { payment_id: "external_payment_id" },
                status: "captured",
              })

            const capturePaymentMock = jest.spyOn(
              (service as any).paymentProviderService_,
              "capturePayment"
            )

            const payment = await service.authorizePaymentSession(
              session.id,
              {}
            )

            expect(authorizePaymentMock).toHaveBeenCalledTimes(1)
            expect(capturePaymentMock).not.toHaveBeenCalled()

            expect(payment).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                amount: 100,
                currency_code: "usd",
                provider_id: "pp_system_default",
                captured_at: expect.any(Date),
                captures: [expect.objectContaining({})],
                payment_session: expect.objectContaining({
                  status: "authorized",
                  authorized_at: expect.any(Date),
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
            })

            expect(updatedPayment).toEqual(
              expect.objectContaining({
                id: "pay-id-1",
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

          it("should return payment if payment is already captured", async () => {
            await service.capturePayment({
              amount: 100,
              payment_id: "pay-id-1",
            })

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
                    amount: 100,
                  }),
                ],
                captured_at: expect.any(Date),
              })
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

          it("should not call provider capturePayment for auto-captured payments", async () => {
            const collection = await service.createPaymentCollections({
              amount: 200,
              currency_code: "usd",
            })

            const session = await service.createPaymentSession(collection.id, {
              provider_id: "pp_system_default",
              amount: 100,
              currency_code: "usd",
              data: {},
              context: {
                customer: { id: "cus-id-1", email: "new@test.tsst" },
              },
            })

            // Mock the provider to return CAPTURED status for auto-capture
            jest
              .spyOn(
                (service as any).paymentProviderService_,
                "authorizePayment"
              )
              .mockResolvedValueOnce({
                data: { payment_id: "external_payment_id" },
                status: "captured",
              })

            const payment = await service.authorizePaymentSession(
              session.id,
              {}
            )

            // Spy on capturePayment provider method
            const capturePaymentMock = jest.spyOn(
              (service as any).paymentProviderService_,
              "capturePayment"
            )

            // Try to capture the already auto-captured payment
            const capturedPayment = await service.capturePayment({
              amount: 100,
              payment_id: payment.id,
            })

            // Provider's capturePayment should NOT be called since it was auto-captured
            expect(capturePaymentMock).not.toHaveBeenCalled()

            // Verify data consistency
            expect(capturedPayment).toEqual(
              expect.objectContaining({
                id: payment.id,
                amount: 100,
                captured_at: expect.any(Date),
                captures: [
                  expect.objectContaining({
                    amount: 100,
                  }),
                ],
              })
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

          it("should fully refund a payment through two refunds", async () => {
            await service.capturePayment({
              amount: 100,
              payment_id: "pay-id-2",
            })

            const refundedPaymentOne = await service.refundPayment({
              amount: 50,
              payment_id: "pay-id-2",
            })

            const refundedPaymentTwo = await service.refundPayment({
              amount: 50,
              payment_id: "pay-id-2",
            })

            expect(refundedPaymentOne).toEqual(
              expect.objectContaining({
                id: "pay-id-2",
                amount: 100,
                refunds: [
                  expect.objectContaining({
                    created_by: null,
                    amount: 50,
                  }),
                ],
              })
            )
            expect(refundedPaymentTwo).toEqual(
              expect.objectContaining({
                id: "pay-id-2",
                amount: 100,
                refunds: [
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

          it("should throw if total refunded amount is greater than captured amount", async () => {
            await service.capturePayment({
              amount: 100,
              payment_id: "pay-id-1",
            })

            const refundedPayment1 = await service.refundPayment({
              amount: 50,
              payment_id: "pay-id-1",
            })

            expect(refundedPayment1).toEqual(
              expect.objectContaining({
                id: "pay-id-1",
                amount: 100,
                refunds: [
                  expect.objectContaining({
                    amount: 50,
                  }),
                ],
              })
            )

            const error = await service
              .refundPayment({
                amount: 60,
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
                status: "completed",
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
