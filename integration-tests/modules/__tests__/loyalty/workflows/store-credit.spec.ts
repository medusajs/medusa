import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  createStoreCreditAccountsWorkflow,
  creditAccountsWorkflow,
  debitAccountsWorkflow,
} from "@medusajs/loyalty-plugin/workflows"
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
    })

    describe("debitAccountsWorkflow", () => {
      beforeEach(async () => {
        await creditAccountsWorkflow.run({
          input: [
            {
              account_id: storeCreditAccount.id,
              amount: 100,
              reference: "test",
              reference_id: "test-id",
            },
          ],
          container: getContainer(),
        })
      })

      it("successfully debits the account", async () => {
        const { result: transactions } = await debitAccountsWorkflow.run({
          input: [
            {
              account_id: storeCreditAccount.id,
              amount: 100,
              reference: "test",
              reference_id: "test-id",
            },
          ],
          container: getContainer(),
        })

        expect(transactions).toEqual([
          expect.objectContaining({
            account_id: storeCreditAccount.id,
            amount: 100,
            reference: "test",
            reference_id: "test-id",
          }),
        ])
      })

      it("should throw if the amount is greater than the account balance", async () => {
        const { errors } = await debitAccountsWorkflow.run({
          input: [
            {
              account_id: storeCreditAccount.id,
              amount: 201,
              reference: "test",
              reference_id: "test-id",
            },
          ],
          container: getContainer(),
          throwOnError: false,
        })

        expect(errors).toEqual([
          expect.objectContaining({
            error: expect.objectContaining({
              message: "Insufficient balance",
              type: "invalid_data",
            }),
          }),
        ])
      })

      it("should throw if account does not exist", async () => {
        const { errors } = await debitAccountsWorkflow.run({
          input: [
            {
              account_id: "does-not-exist",
              amount: 201,
              reference: "test",
              reference_id: "test-id",
            },
          ],
          container: getContainer(),
          throwOnError: false,
        })

        expect(errors).toEqual([
          expect.objectContaining({
            error: expect.objectContaining({
              message:
                "StoreCreditAccount with id: does-not-exist was not found",
              type: "not_found",
            }),
          }),
        ])
      })

      it("should throw if amount does not exist", async () => {
        const { errors } = await debitAccountsWorkflow.run({
          input: [
            {
              account_id: storeCreditAccount.id,
              reference: "test",
              reference_id: "test-id",
            },
          ],
          container: getContainer(),
          throwOnError: false,
        })

        expect(errors).toEqual([
          expect.objectContaining({
            error: expect.objectContaining({
              message: "Amount is required",
              type: "invalid_data",
            }),
          }),
        ])
      })
    })
  },
})
