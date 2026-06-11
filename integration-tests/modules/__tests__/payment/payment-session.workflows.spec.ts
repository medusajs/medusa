import {
  createPaymentSessionsWorkflow,
  createPaymentSessionsWorkflowId,
} from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  ICustomerModuleService,
  IPaymentModuleService,
  IRegionModuleService,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/utils"

jest.setTimeout(50000)

const env = {}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Carts workflows", () => {
      let appContainer
      let paymentModule: IPaymentModuleService
      let regionModule: IRegionModuleService
      let customerModule: ICustomerModuleService
      let query

      beforeAll(async () => {
        appContainer = getContainer()
        paymentModule = appContainer.resolve(Modules.PAYMENT)
        regionModule = appContainer.resolve(Modules.REGION)
        customerModule = appContainer.resolve(Modules.CUSTOMER)
        query = appContainer.resolve(ContainerRegistrationKeys.QUERY)
      })

      describe("createPaymentSessionWorkflow", () => {
        let region
        let paymentCollection
        let customer

        beforeEach(async () => {
          region = await regionModule.createRegions({
            currency_code: "usd",
            name: "US",
          })

          paymentCollection = await paymentModule.createPaymentCollections({
            currency_code: "usd",
            amount: 1000,
          })

          customer = await customerModule.createCustomers({
            email: "test@test.com",
            first_name: "Test",
            last_name: "Test",
          })
        })

        it("should create payment sessions", async () => {
          await createPaymentSessionsWorkflow(appContainer).run({
            input: {
              payment_collection_id: paymentCollection.id,
              provider_id: "pp_system_default",
              context: {},
              data: {},
            },
          })

          paymentCollection = await paymentModule.retrievePaymentCollection(
            paymentCollection.id,
            {
              relations: ["payment_sessions"],
            }
          )

          expect(paymentCollection).toEqual(
            expect.objectContaining({
              id: paymentCollection.id,
              currency_code: "usd",
              amount: 1000,
              payment_sessions: expect.arrayContaining([
                expect.objectContaining({
                  amount: 1000,
                  currency_code: "usd",
                  provider_id: "pp_system_default",
                }),
              ]),
            })
          )
        })

        it("should create payment sessions with customer", async () => {
          await createPaymentSessionsWorkflow(appContainer).run({
            input: {
              payment_collection_id: paymentCollection.id,
              provider_id: "pp_system_default",
              customer_id: customer.id,
            },
          })

          const {
            data: [updatedPaymentCollection],
          } = await query.graph({
            entity: "payment_collection",
            filters: {
              id: paymentCollection.id,
            },
            fields: ["id", "currency_code", "amount", "payment_sessions.*"],
          })

          expect(updatedPaymentCollection.payment_sessions).toHaveLength(1)
          expect(updatedPaymentCollection).toEqual(
            expect.objectContaining({
              id: paymentCollection.id,
              currency_code: "usd",
              amount: 1000,
              payment_sessions: expect.arrayContaining([
                expect.objectContaining({
                  context: expect.objectContaining({
                    customer: expect.objectContaining({
                      id: customer.id,
                    }),
                    account_holder: expect.objectContaining({
                      email: customer.email,
                    }),
                  }),
                }),
              ]),
            })
          )
        })

        it("should create payment sessions when customer has no account_holder links)", async () => {
          const {
            data: [customerBefore],
          } = await query.graph({
            entity: "customer",
            filters: { id: customer.id },
            fields: ["id", "account_holders.*"],
          })

          expect(
            customerBefore.account_holders === undefined ||
              customerBefore.account_holders?.length === 0
          ).toBe(true)

          await createPaymentSessionsWorkflow(appContainer).run({
            input: {
              payment_collection_id: paymentCollection.id,
              provider_id: "pp_system_default",
              customer_id: customer.id,
            },
          })

          const {
            data: [updatedPaymentCollection],
          } = await query.graph({
            entity: "payment_collection",
            filters: { id: paymentCollection.id },
            fields: ["id", "payment_sessions.*"],
          })

          expect(updatedPaymentCollection.payment_sessions).toHaveLength(1)

          const {
            data: [customerAfter],
          } = await query.graph({
            entity: "customer",
            filters: { id: customer.id },
            fields: ["id", "account_holders.*"],
          })

          expect(customerAfter.account_holders).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                email: customer.email,
              }),
            ])
          )
        })

        it("should not accumulate sessions when re-initializing for the same provider", async () => {
          // Re-initializing reuses the existing unconfirmed session in place
          // rather than deleting + recreating, so the collection never ends up
          // with more than one session per provider.
          await createPaymentSessionsWorkflow(appContainer).run({
            input: {
              payment_collection_id: paymentCollection.id,
              provider_id: "pp_system_default",
              context: {},
              data: {},
            },
          })

          await createPaymentSessionsWorkflow(appContainer).run({
            input: {
              payment_collection_id: paymentCollection.id,
              provider_id: "pp_system_default",
              context: {},
              data: {},
            },
          })

          paymentCollection = await paymentModule.retrievePaymentCollection(
            paymentCollection.id,
            { relations: ["payment_sessions"] }
          )

          expect(paymentCollection).toEqual(
            expect.objectContaining({
              id: paymentCollection.id,
              currency_code: "usd",
              amount: 1000,
              payment_sessions: [
                expect.objectContaining({
                  amount: 1000,
                  currency_code: "usd",
                  provider_id: "pp_system_default",
                }),
              ],
            })
          )
        })

        it("should reuse an existing unconfirmed session instead of recreating it", async () => {
          const { result: first } = await createPaymentSessionsWorkflow(
            appContainer
          ).run({
            input: {
              payment_collection_id: paymentCollection.id,
              provider_id: "pp_system_default",
              context: {},
              data: {},
            },
          })

          // Change the collection amount so we can assert the reused session is
          // updated in place rather than recreated.
          await paymentModule.updatePaymentCollections(paymentCollection.id, {
            amount: 2000,
          })

          const { result: second } = await createPaymentSessionsWorkflow(
            appContainer
          ).run({
            input: {
              payment_collection_id: paymentCollection.id,
              provider_id: "pp_system_default",
              context: {},
              data: {},
            },
          })

          // Same session reused (same id) => same underlying provider payment,
          // not a freshly created one.
          expect(second.id).toEqual(first.id)

          const {
            data: [updatedPaymentCollection],
          } = await query.graph({
            entity: "payment_collection",
            filters: { id: paymentCollection.id },
            fields: [
              "id",
              "amount",
              "payment_sessions.id",
              "payment_sessions.amount",
            ],
          })

          expect(updatedPaymentCollection.payment_sessions).toHaveLength(1)
          expect(updatedPaymentCollection.payment_sessions[0]).toEqual(
            expect.objectContaining({
              id: first.id,
              amount: 2000,
            })
          )
        })

        it("should create a new session (and delete the old one) when the provider changes", async () => {
          const { result: first } = await createPaymentSessionsWorkflow(
            appContainer
          ).run({
            input: {
              payment_collection_id: paymentCollection.id,
              provider_id: "pp_system_default",
              context: {},
              data: {},
            },
          })

          const { result: second } = await createPaymentSessionsWorkflow(
            appContainer
          ).run({
            input: {
              payment_collection_id: paymentCollection.id,
              provider_id: "pp_system_default_2",
              context: {},
              data: {},
            },
          })

          // Different provider => can't reuse, a new session is created and the
          // old one deleted.
          expect(second.id).not.toEqual(first.id)
          expect(second.provider_id).toEqual("pp_system_default_2")

          const {
            data: [updatedPaymentCollection],
          } = await query.graph({
            entity: "payment_collection",
            filters: { id: paymentCollection.id },
            fields: [
              "id",
              "payment_sessions.id",
              "payment_sessions.provider_id",
            ],
          })

          expect(updatedPaymentCollection.payment_sessions).toHaveLength(1)
          expect(updatedPaymentCollection.payment_sessions[0]).toEqual(
            expect.objectContaining({
              id: second.id,
              provider_id: "pp_system_default_2",
            })
          )
        })

        it("should create a fresh session (without failing) when the in-place update fails for a stale provider payment", async () => {
          const { result: first } = await createPaymentSessionsWorkflow(
            appContainer
          ).run({
            input: {
              payment_collection_id: paymentCollection.id,
              provider_id: "pp_system_default",
              context: {},
              data: {},
            },
          })

          // Simulate the provider payment having vanished out-of-band: the
          // in-place update throws, so the workflow must fall back to a fresh
          // session instead of failing the route.
          const updateSpy = jest
            .spyOn(paymentModule, "updatePaymentSession")
            .mockRejectedValueOnce(new Error("No such payment_intent"))

          const { result: second, errors } =
            await createPaymentSessionsWorkflow(appContainer).run({
              input: {
                payment_collection_id: paymentCollection.id,
                provider_id: "pp_system_default",
                context: {},
                data: {},
              },
              throwOnError: false,
            })

          expect(updateSpy).toHaveBeenCalled()
          expect(errors).toEqual([])

          // A brand-new session replaces the stale one (no failure), and the
          // stale session is gone.
          expect(second.id).not.toEqual(first.id)

          const sessions = await paymentModule.listPaymentSessions({
            payment_collection_id: paymentCollection.id,
          })

          expect(sessions).toHaveLength(1)
          expect(sessions[0].id).toEqual(second.id)

          updateSpy.mockRestore()
        })

        it("should create a fresh session (without failing) when the reused session was deleted before it could be retrieved", async () => {
          const { result: first } = await createPaymentSessionsWorkflow(
            appContainer
          ).run({
            input: {
              payment_collection_id: paymentCollection.id,
              provider_id: "pp_system_default",
              context: {},
              data: {},
            },
          })

          // Simulate the reusable session being deleted out-of-band between the
          // caller resolving it (from the payment-collection query) and the
          // update step retrieving it: retrieve throws NOT_FOUND, so the
          // workflow must fall back to a fresh session instead of failing the
          // route.
          const retrieveSpy = jest
            .spyOn(paymentModule, "retrievePaymentSession")
            .mockRejectedValueOnce(
              new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `Payment session with id: ${first.id} was not found`
              )
            )

          const { result: second, errors } =
            await createPaymentSessionsWorkflow(appContainer).run({
              input: {
                payment_collection_id: paymentCollection.id,
                provider_id: "pp_system_default",
                context: {},
                data: {},
              },
              throwOnError: false,
            })

          expect(retrieveSpy).toHaveBeenCalled()
          expect(errors).toEqual([])

          // A brand-new session replaces the stale one (no failure), and the
          // stale session is gone.
          expect(second.id).not.toEqual(first.id)

          const sessions = await paymentModule.listPaymentSessions({
            payment_collection_id: paymentCollection.id,
          })

          expect(sessions).toHaveLength(1)
          expect(sessions[0].id).toEqual(second.id)

          retrieveSpy.mockRestore()
        })

        it("should fail (without deleting and recreating the session) when retrieving the reused session errors transiently", async () => {
          const { result: first } = await createPaymentSessionsWorkflow(
            appContainer
          ).run({
            input: {
              payment_collection_id: paymentCollection.id,
              provider_id: "pp_system_default",
              context: {},
              data: {},
            },
          })

          // A transient (non-NOT_FOUND) error on retrieve must propagate and
          // fail the step rather than deleting the still-existing session and
          // recreating it — recreating would spawn a new provider payment, the
          // exact proliferation this flow avoids.
          const retrieveSpy = jest
            .spyOn(paymentModule, "retrievePaymentSession")
            .mockRejectedValueOnce(new Error("connection terminated unexpectedly"))

          const { errors } = await createPaymentSessionsWorkflow(
            appContainer
          ).run({
            input: {
              payment_collection_id: paymentCollection.id,
              provider_id: "pp_system_default",
              context: {},
              data: {},
            },
            throwOnError: false,
          })

          expect(retrieveSpy).toHaveBeenCalled()
          expect(errors).not.toEqual([])

          // The original session is untouched: neither deleted nor replaced by a
          // fresh one (which would mean a new provider payment).
          const sessions = await paymentModule.listPaymentSessions({
            payment_collection_id: paymentCollection.id,
          })

          expect(sessions).toHaveLength(1)
          expect(sessions[0].id).toEqual(first.id)

          retrieveSpy.mockRestore()
        })

        describe("compensation", () => {
          it("should delete created payment collection if a subsequent step fails", async () => {
            const workflow = createPaymentSessionsWorkflow(appContainer)

            workflow.appendAction("throw", createPaymentSessionsWorkflowId, {
              invoke: async function failStep() {
                throw new Error(
                  `Failed to do something after creating payment sessions`
                )
              },
            })

            const region = await regionModule.createRegions({
              currency_code: "usd",
              name: "US",
            })

            let paymentCollection =
              await paymentModule.createPaymentCollections({
                currency_code: "usd",
                amount: 1000,
              })

            const { errors } = await workflow.run({
              input: {
                payment_collection_id: paymentCollection.id,
                provider_id: "pp_system_default",
                context: {},
                data: {},
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Failed to do something after creating payment sessions`,
                }),
              },
            ])

            const sessions = await paymentModule.listPaymentSessions({
              payment_collection_id: paymentCollection.id,
            })

            expect(sessions).toHaveLength(0)
          })

          it("should revert the in-place amount update of a reused session if a subsequent step fails", async () => {
            // Seed an unconfirmed session that the next run will reuse.
            const { result: first } = await createPaymentSessionsWorkflow(
              appContainer
            ).run({
              input: {
                payment_collection_id: paymentCollection.id,
                provider_id: "pp_system_default",
                context: {},
                data: {},
              },
            })

            // Change the collection amount so the reuse path updates the
            // session's amount in place (1000 -> 2000) before the failing step.
            await paymentModule.updatePaymentCollections(paymentCollection.id, {
              amount: 2000,
            })

            const workflow = createPaymentSessionsWorkflow(appContainer)

            workflow.appendAction("throw", createPaymentSessionsWorkflowId, {
              invoke: async function failStep() {
                throw new Error(
                  `Failed to do something after creating payment sessions`
                )
              },
            })

            const { errors } = await workflow.run({
              input: {
                payment_collection_id: paymentCollection.id,
                provider_id: "pp_system_default",
                context: {},
                data: {},
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Failed to do something after creating payment sessions`,
                }),
              },
            ])

            // The reused session is kept (not deleted) and its amount is reverted
            // to the pre-update value, so the provider payment is left as it was.
            const sessions = await paymentModule.listPaymentSessions({
              payment_collection_id: paymentCollection.id,
            })

            expect(sessions).toHaveLength(1)
            expect(sessions[0]).toEqual(
              expect.objectContaining({
                id: first.id,
                amount: 1000,
              })
            )
          })

          it("should not delete account holder if it exists before creating payment sessions", async () => {
            await createPaymentSessionsWorkflow(appContainer).run({
              input: {
                payment_collection_id: paymentCollection.id,
                provider_id: "pp_system_default",
                customer_id: customer.id,
              },
            })

            const {
              data: [updatedCustomer1],
            } = await query.graph({
              entity: "customer",
              filters: {
                id: customer.id,
              },
              fields: ["id", "account_holders.*"],
            })

            expect(updatedCustomer1.account_holders).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  email: customer.email,
                }),
              ])
            )

            const newPaymentCollection =
              await paymentModule.createPaymentCollections({
                currency_code: "usd",
                amount: 2000,
              })

            const workflow = createPaymentSessionsWorkflow(appContainer)

            workflow.appendAction("throw", createPaymentSessionsWorkflowId, {
              invoke: async function failStep() {
                throw new Error(
                  `Failed to do something after creating payment sessions`
                )
              },
            })

            const { errors } = await workflow.run({
              input: {
                payment_collection_id: newPaymentCollection.id,
                provider_id: "pp_system_default",
                customer_id: customer.id,
                context: {},
                data: {},
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Failed to do something after creating payment sessions`,
                }),
              },
            ])

            const {
              data: [updatedCustomer2],
            } = await query.graph({
              entity: "customer",
              filters: {
                id: customer.id,
              },
              fields: ["id", "account_holders.*"],
            })

            expect(updatedCustomer2.account_holders).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  email: customer.email,
                }),
              ])
            )
          })

          it("should skip compensation for account holder step on failure", async () => {
            // Spy on deleteAccountHolder to verify it's NOT called during compensation
            const deleteAccountHolderSpy = jest.spyOn(
              paymentModule,
              "deleteAccountHolder"
            )

            const newCustomer = await customerModule.createCustomers({
              email: "new-customer@test.com",
              first_name: "New",
              last_name: "Customer",
            })

            const newPaymentCollection =
              await paymentModule.createPaymentCollections({
                currency_code: "usd",
                amount: 3000,
              })

            const workflow = createPaymentSessionsWorkflow(appContainer)

            workflow.appendAction("throw", createPaymentSessionsWorkflowId, {
              invoke: async function failStep() {
                throw new Error(
                  `Failed to do something after creating payment sessions`
                )
              },
            })

            const { errors } = await workflow.run({
              input: {
                payment_collection_id: newPaymentCollection.id,
                provider_id: "pp_system_default",
                customer_id: newCustomer.id,
                context: {},
                data: {},
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Failed to do something after creating payment sessions`,
                }),
              },
            ])

            // Verify deleteAccountHolder was NOT called because noCompensation: true
            // prevents the compensation function from running
            expect(deleteAccountHolderSpy).not.toHaveBeenCalled()

            deleteAccountHolderSpy.mockRestore()
          })
        })
      })
    })
  },
})
