import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60 * 1000)

const storeCreditAccountPayload = {
  customer_id: "cus_123",
  currency_code: "usd",
}

const storeCreditAccountResponse = {
  id: expect.any(String),
  customer_id: "cus_123",
  currency_code: "usd",
  metadata: null,
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let adminUser

    beforeEach(async () => {
      const user = await createAdminUser(
        dbConnection,
        adminHeaders,
        getContainer()
      )
      adminUser = user.user
    })

    describe("GET /admin/store-credit-accounts", () => {
      let customer1, customer2

      beforeEach(async () => {
        customer1 = (
          await api.post(
            `/admin/customers`,
            { email: "test@test.com" },
            adminHeaders
          )
        ).data.customer

        await api.post(
          `/admin/store-credit-accounts`,
          { ...storeCreditAccountPayload, customer_id: customer1.id },
          adminHeaders
        )

        customer2 = (
          await api.post(
            `/admin/customers`,
            { email: "test2@test.com" },
            adminHeaders
          )
        ).data.customer

        await api.post(
          `/admin/store-credit-accounts`,
          { ...storeCreditAccountPayload, customer_id: customer2.id },
          adminHeaders
        )
      })

      it("successfully returns all store credit accounts", async () => {
        const {
          data: { store_credit_accounts },
        } = await api.get(`/admin/store-credit-accounts`, adminHeaders)

        expect(store_credit_accounts).toHaveLength(2)
        expect(store_credit_accounts).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              currency_code: "usd",
              customer_id: customer1.id,
              customer: expect.objectContaining({
                id: customer1.id,
              }),
            }),
            expect.objectContaining({
              currency_code: "usd",
              customer_id: customer2.id,
              customer: expect.objectContaining({
                id: customer2.id,
              }),
            }),
          ])
        )

        const {
          data: { store_credit_accounts: storeCreditAccounts2 },
        } = await api.get(
          `/admin/store-credit-accounts?customer_id=${customer1.id}&currency_code=usd`,
          adminHeaders
        )

        expect(storeCreditAccounts2).toEqual([
          expect.objectContaining({
            currency_code: "usd",
            customer_id: customer1.id,
            customer: expect.objectContaining({
              id: customer1.id,
            }),
          }),
        ])
      })
    })

    describe("GET /admin/store-credit-accounts/:id", () => {
      it("should retrieve a store credit account by id", async () => {
        const {
          data: { store_credit_account },
        } = await api.post(
          `/admin/store-credit-accounts`,
          storeCreditAccountPayload,
          adminHeaders
        )

        const {
          data: { store_credit_account: storeCreditAccount },
        } = await api.get(
          `/admin/store-credit-accounts/${store_credit_account.id}`,
          adminHeaders
        )

        expect(storeCreditAccount).toEqual(
          expect.objectContaining(storeCreditAccountResponse)
        )
      })

      it("should throw an error if the store credit account does not exist", async () => {
        const { response } = await api
          .get(`/admin/store-credit-accounts/does-not-exist`, adminHeaders)
          .catch((e) => e)

        expect(response.data).toEqual({
          message: "StoreCreditAccount id not found: does-not-exist",
          type: "not_found",
        })
      })
    })

    describe("POST /admin/store-credit-accounts", () => {
      it("successfully creates a store credit account", async () => {
        const {
          data: { store_credit_account },
        } = await api.post(
          `/admin/store-credit-accounts`,
          storeCreditAccountPayload,
          adminHeaders
        )

        expect(store_credit_account).toEqual(
          expect.objectContaining(storeCreditAccountResponse)
        )
      })

      it("should throw an error if required params are missing", async () => {
        const { response } = await api
          .post(`/admin/store-credit-accounts`, {}, adminHeaders)
          .catch((e) => e)

        expect(response.data).toEqual({
          message: "Invalid request: Field 'currency_code' is required",
          type: "invalid_data",
        })
      })
    })

    describe("POST /admin/store-credit-accounts/:id/credit", () => {
      it("successfully credits a store credit account", async () => {
        let {
          data: { store_credit_account },
        } = await api.post(
          `/admin/store-credit-accounts?fields=*transactions`,
          { currency_code: "usd" },
          adminHeaders
        )

        expect(store_credit_account).toEqual(
          expect.objectContaining({
            customer_id: null,
            currency_code: "usd",
            metadata: null,
            balance: 0,
            credits: 0,
            debits: 0,
            transactions: [],
          })
        )

        store_credit_account = (
          await api.post(
            `/admin/store-credit-accounts/${store_credit_account.id}/credit?fields=*transactions`,
            { amount: 100, note: "Crediting an account 1" },
            adminHeaders
          )
        ).data.store_credit_account

        expect(store_credit_account).toEqual(
          expect.objectContaining({
            customer_id: null,
            currency_code: "usd",
            metadata: null,
            balance: 100,
            credits: 100,
            debits: 0,
            transactions: [
              expect.objectContaining({
                amount: 100,
                type: "credit",
                note: "Crediting an account 1",
                reference: "user",
                reference_id: adminUser.id,
              }),
            ],
          })
        )

        store_credit_account = (
          await api.post(
            `/admin/store-credit-accounts/${store_credit_account.id}/credit?fields=*transactions`,
            { amount: 150, note: "Crediting an account 2" },
            adminHeaders
          )
        ).data.store_credit_account

        expect(store_credit_account).toEqual(
          expect.objectContaining({
            customer_id: null,
            currency_code: "usd",
            metadata: null,
            balance: 250,
            credits: 250,
            debits: 0,
            transactions: expect.arrayContaining([
              expect.objectContaining({
                amount: 100,
                note: "Crediting an account 1",
                type: "credit",
                reference: "user",
                reference_id: adminUser.id,
              }),
              expect.objectContaining({
                amount: 150,
                type: "credit",
                note: "Crediting an account 2",
                reference: "user",
                reference_id: adminUser.id,
              }),
            ]),
          })
        )
      })

      it("should throw an error if the amount is negative", async () => {
        let {
          data: { store_credit_account },
        } = await api.post(
          `/admin/store-credit-accounts?fields=*transactions`,
          { currency_code: "usd" },
          adminHeaders
        )

        const { response } = await api
          .post(
            `/admin/store-credit-accounts/${store_credit_account.id}/credit`,
            { amount: -20 },
            adminHeaders
          )
          .catch((e) => e)

        expect(response.data).toEqual({
          message: "Amount must be greater than 0",
          type: "invalid_data",
        })
      })
    })
  },
})
