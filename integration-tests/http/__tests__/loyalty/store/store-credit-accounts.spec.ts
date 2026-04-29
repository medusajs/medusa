import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { createAuthenticatedCustomer } from "../../../../modules/helpers/create-authenticated-customer"

jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let customer
    let customer2
    let storeCreditAccount, storeCreditAccount2
    let storeHeaders, storeHeaders2
    let currencyCode = "usd"

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
      const publishableKey = await generatePublishableKey(getContainer())
      storeHeaders = generateStoreHeaders({ publishableKey })
      storeHeaders2 = generateStoreHeaders({ publishableKey })

      const user = await createAuthenticatedCustomer(api, storeHeaders, {
        email: "initial@customer.com",
      })

      const user2 = await createAuthenticatedCustomer(api, storeHeaders, {
        email: "invited@customer.com",
      })

      storeHeaders.headers["Authorization"] = `Bearer ${user.jwt}`
      storeHeaders2.headers["Authorization"] = `Bearer ${user2.jwt}`
      customer = user.customer
      customer2 = user2.customer

      storeCreditAccount = (
        await api.post(
          `/admin/store-credit-accounts`,
          { currency_code: currencyCode, customer_id: customer.id },
          adminHeaders
        )
      ).data.store_credit_account

      storeCreditAccount2 = (
        await api.post(
          `/admin/store-credit-accounts`,
          { currency_code: currencyCode, customer_id: customer2.id },
          adminHeaders
        )
      ).data.store_credit_account
    })

    describe("GET /store/store-credit-accounts", () => {
      it("should return all store credit accounts for a customer", async () => {
        const {
          data: { store_credit_accounts },
        } = await api.get(
          `/store/store-credit-accounts?currency_code=${currencyCode}`,
          storeHeaders
        )

        expect(store_credit_accounts).toHaveLength(1)
        expect(store_credit_accounts).toEqual([
          expect.objectContaining({
            currency_code: "usd",
            customer_id: customer.id,
          }),
        ])

        const {
          data: { store_credit_accounts: storeCreditAccounts2 },
        } = await api.get(
          `/store/store-credit-accounts?currency_code=${currencyCode}`,
          storeHeaders2
        )

        expect(storeCreditAccounts2).toHaveLength(1)
        expect(storeCreditAccounts2).toEqual([
          expect.objectContaining({
            currency_code: "usd",
            customer_id: customer2.id,
          }),
        ])
      })

      it("should throw error when customer is not authenticated", async () => {
        delete storeHeaders.headers["Authorization"]

        const { response } = await api
          .get(
            `/store/store-credit-accounts?currency_code=${currencyCode}`,
            storeHeaders
          )
          .catch((e) => e)

        expect(response.status).toBe(401)
        expect(response.data.message).toBe("Unauthorized")
      })
    })

    describe("GET /store/store-credit-accounts/:id", () => {
      it("should return specific store credit accounts for a customer", async () => {
        const {
          data: { store_credit_account },
        } = await api.get(
          `/store/store-credit-accounts/${storeCreditAccount.id}`,
          storeHeaders
        )

        expect(store_credit_account).toEqual(
          expect.objectContaining({
            currency_code: "usd",
            customer_id: customer.id,
          })
        )

        const {
          data: { store_credit_account: sca2 },
        } = await api.get(
          `/store/store-credit-accounts/${storeCreditAccount2.id}`,
          storeHeaders2
        )

        expect(sca2).toEqual(
          expect.objectContaining({
            currency_code: "usd",
            customer_id: customer2.id,
          })
        )
      })

      it("should throw error when customer is not authenticated", async () => {
        delete storeHeaders.headers["Authorization"]

        const { response } = await api
          .get(
            `/store/store-credit-accounts/${storeCreditAccount.id}`,
            storeHeaders
          )
          .catch((e) => e)

        expect(response.status).toBe(401)
        expect(response.data.message).toBe("Unauthorized")
      })
    })

    describe("POST /store/store-credit-accounts/claim", () => {
      it("should claim an anonymous account for a customer", async () => {
        const container = getContainer()
        const storeCreditService = container.resolve("store_credit")

        const [sourceCreditAccount] =
          await storeCreditService.createStoreCreditAccounts([
            {
              currency_code: currencyCode,
              code: "SC-XYZ-ABC",
            },
          ])

        await storeCreditService.creditAccounts([
          {
            account_id: sourceCreditAccount.id,
            amount: 100,
            reference: "TEST1",
            reference_id: "TEST1",
          },
        ])

        const anonymousCreditAccount = (
          await api.get(
            `/admin/store-credit-accounts/${sourceCreditAccount.id}`,
            adminHeaders
          )
        ).data.store_credit_account

        await api.post(
          `/store/store-credit-accounts/claim`,
          { code: anonymousCreditAccount.code },
          storeHeaders
        )

        const claimedCreditAccount = (
          await api.get(
            `/admin/store-credit-accounts/${anonymousCreditAccount.id}?fields=*transactions`,
            adminHeaders
          )
        ).data.store_credit_account

        const targetAccount = (
          await api.get(
            `/admin/store-credit-accounts/${storeCreditAccount.id}?fields=*transactions`,
            adminHeaders
          )
        ).data.store_credit_account

        expect(claimedCreditAccount).toEqual(
          expect.objectContaining({
            balance: 0,

            credits: 100,
            debits: 100,
            code: "SC-XYZ-ABC",
            currency_code: "usd",
            customer_id: null,

            transactions: expect.arrayContaining([
              expect.objectContaining({
                amount: 100,
                type: "credit", // initial crediting
              }),
              expect.objectContaining({
                amount: 100,
                type: "debit", // claim debit
                reference: "store-credit",
                reference_id: targetAccount.id,
              }),
            ]),
          })
        )

        expect(targetAccount).toEqual(
          expect.objectContaining({
            balance: 100,

            debits: 0,
            credits: 100,

            currency_code: "usd",
            customer_id: customer.id,

            transactions: expect.arrayContaining([
              expect.objectContaining({
                amount: 100,
                type: "credit",
              }),
            ]),
          })
        )
      })
    })
  },
})
