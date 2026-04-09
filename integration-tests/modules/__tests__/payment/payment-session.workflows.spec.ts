import {
  createPaymentSessionsWorkflow,
  createPaymentSessionsWorkflowId,
} from "@medusajs/core-flows"
import { ICartModuleService, IPaymentModuleService, IRegionModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  ICustomerModuleService,
  IPaymentModuleService,
  IRegionModuleService,
} from "@medusajs/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"

jest.setTimeout(50000)

const env = {}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Carts workflows", () => {
      let appContainer
      let paymentModule: IPaymentModuleService
      let regionModule: IRegionModuleService
      let cartModule: ICartModuleService
      let remoteLink
      let customerModule: ICustomerModuleService
      let query

      beforeAll(async () => {
        appContainer = getContainer()
        paymentModule = appContainer.resolve(Modules.PAYMENT)
        regionModule = appContainer.resolve(Modules.REGION)
        cartModule = appContainer.resolve(Modules.CART)
        remoteLink = appContainer.resolve("remoteLink")
        customerModule = appContainer.resolve(Modules.CUSTOMER)
        query = appContainer.resolve(ContainerRegistrationKeys.QUERY)
      })

      describe("createPaymentSessionsWorkflow", () => {
        let region
        let paymentCollection
        let cart
        let customer

        beforeEach(async () => {
          region = await regionModule.createRegions({
            currency_code: "usd",
            name: "US",
          })

          cart = await cartModule.createCarts({
            region_id: region.id,
            currency_code: "usd",
            items: [
              {
                quantity: 1,
                unit_price: 1000,
                title: "Test Item",
              }
            ]
          })

          paymentCollection = await paymentModule.createPaymentCollections({
            currency_code: "usd",
            amount: 1000,
          })

          await remoteLink.create({
            [Modules.CART]: {
              cart_id: cart.id,
            },
            [Modules.PAYMENT]: {
              payment_collection_id: paymentCollection.id,
            },
            
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
                  context: expect.objectContaining({
                    cart: expect.objectContaining({
                      id: cart.id,
                      currency_code: "usd",
                      items: expect.arrayContaining([
                        expect.objectContaining({
                          id: expect.any(String),
                          tax_lines: expect.arrayContaining([]),
                        })
                      ]),
                      total: 1000,
                      subtotal: 1000,
                      tax_total: 0,
                      discount_total: 0,
                      discount_tax_total: 0,
                      shipping_total: 0,
                      shipping_subtotal: 0,
                      shipping_tax_total: 0, 
                      item_total: 1000,
                      item_subtotal: 1000,
                    }),
                  }),
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

        it("should delete existing sessions when create payment sessions", async () => {
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
