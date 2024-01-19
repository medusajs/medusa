import { IPaymentModuleService } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"

import { initialize } from "../../../../src"
import { DB_URL, MikroOrmWrapper } from "../../../utils"
import { createPaymentCollections } from "../../../__fixtures__/payment-collection"

jest.setTimeout(30000)

describe("Payment Module Service", () => {
  let service: IPaymentModuleService

  describe("PaymentCollection", () => {
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

        await service.deletePaymentCollection(["pay-col-id-1"])

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
            payment_sessions: [
              {
                id: expect.any(String),
                currency_code: "usd",
                amount: 200,
                provider_id: "manual",
                status: "pending",
                payment_collection: expect.objectContaining({
                  id: "pay-col-id-1",
                }),
                authorized_at: null,
                payment: null,
                data: null,
              },
            ],
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
          payment_session_id: paymentCollection.payment_sessions[0].id,
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
            payment_collection: paymentCollection.id,
          })
        )
      })
    })

    describe("update", () => {
      it("should update a payment successfully", async () => {
        // TODO: refactor when factory is added

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
          payment_session_id: paymentCollection.payment_sessions[0].id,
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
            payment_collection: paymentCollection.id,
          })
        )

        const updatedPayment = await service.updatePayment({
          id: createdPayment.id,
          cart_id: "new-cart",
        })

        expect(updatedPayment).toEqual(
          expect.objectContaining({
            id: createdPayment.id,
            cart_id: "new-cart",
          })
        )
      })
    })
  })
})
