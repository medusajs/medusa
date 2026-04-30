import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { createStoreCreditAccountsWorkflow } from "@medusajs/loyalty-plugin/workflows"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { createAuthenticatedCustomer } from "../../../helpers/create-authenticated-customer"

jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let customer, storeCreditAccount, storeHeaders

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
      const publishableKey = await generatePublishableKey(getContainer())
      storeHeaders = generateStoreHeaders({ publishableKey })

      const user = await createAuthenticatedCustomer(api, storeHeaders, {
        email: "initial@customer.com",
      })
      storeHeaders.headers["Authorization"] = `Bearer ${user.jwt}`
      customer = user.customer
    })

    describe("createStoreCreditAccountsWorkflow", () => {
      it("successfully creates a store credit account for customer", async () => {
        const { result: storeCreditAccounts } =
          await createStoreCreditAccountsWorkflow.run({
            input: [
              {
                customer_id: customer.id,
                currency_code: "USD",
              },
            ],
            container: getContainer(),
          })

        storeCreditAccount = storeCreditAccounts[0]

        expect(storeCreditAccount).toEqual(
          expect.objectContaining({
            customer_id: customer.id,
            currency_code: "USD",
          })
        )
      })

      it("successfully creates a store credit account for anonymous customer", async () => {
        const { result: storeCreditAccounts } =
          await createStoreCreditAccountsWorkflow.run({
            input: [
              {
                currency_code: "USD",
              },
            ],
            container: getContainer(),
          })

        storeCreditAccount = storeCreditAccounts[0]

        expect(storeCreditAccount).toEqual(
          expect.objectContaining({
            customer_id: null,
            currency_code: "USD",
          })
        )
      })

      it("successfully create two anonymous store credit accounts", async () => {
        const { result: storeCreditAccountsOne } =
          await createStoreCreditAccountsWorkflow.run({
            input: [
              {
                currency_code: "USD",
              },
              {
                currency_code: "USD",
              },
            ],
            container: getContainer(),
          })

        expect(storeCreditAccountsOne).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              customer_id: null,
              currency_code: "USD",
            }),
            expect.objectContaining({
              customer_id: null,
              currency_code: "USD",
            }),
          ])
        )
      })

      it("fail to create store credit account if currency_code + customer combination already exists", async () => {
        const { result: storeCreditAccountsOne } =
          await createStoreCreditAccountsWorkflow.run({
            input: [
              {
                customer_id: customer.id,
                currency_code: "USD",
              },
            ],
            container: getContainer(),
          })

        storeCreditAccount = storeCreditAccountsOne[0]

        expect(storeCreditAccount).toEqual(
          expect.objectContaining({
            customer_id: customer.id,
            currency_code: "USD",
          })
        )

        const { errors } = await createStoreCreditAccountsWorkflow.run({
          input: [
            {
              currency_code: "USD",
              customer_id: customer.id,
            },
          ],
          container: getContainer(),
          throwOnError: false,
        })

        const error = errors[0]

        expect(error.error.message).toEqual(
          `Store credit account with customer_id: ${customer.id}, currency_code: USD, already exists.`
        )
      })

      it("should fail to create a store credit account if currency code is not provided", async () => {
        const { errors } = await createStoreCreditAccountsWorkflow.run({
          input: [{}],
          container: getContainer(),
          throwOnError: false,
        })

        const error = errors[0]

        expect(error.error.message).toEqual(
          "Currency code is required to create a store credit account"
        )
      })
    })
  },
})
