import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { PluginModule } from "../../src/types"
import { IStoreCreditModuleService } from "../../src/types"

jest.setTimeout(30000)

moduleIntegrationTestRunner<IStoreCreditModuleService>({
  moduleName: PluginModule.STORE_CREDIT,
  resolve: __dirname + "/../../src/modules/store-credit",
  testSuite: ({ service }) => {
    describe("StoreCreditService", () => {
      describe("StoreCreditAccount", () => {
        it("should create a store credit account", async () => {
          const account = await service.createStoreCreditAccounts({
            currency_code: "usd",
            customer_id: "cust_01",
          })

          expect(account).toEqual(
            expect.objectContaining({
              id: expect.stringMatching(/^sc_acc_/),
              currency_code: "usd",
              customer_id: "cust_01",
            })
          )
        })

        it("should retrieve a store credit account by id", async () => {
          const created = await service.createStoreCreditAccounts({
            currency_code: "eur",
            customer_id: "cust_02",
          })

          const retrieved = await service.retrieveStoreCreditAccount(created.id)

          expect(retrieved).toEqual(
            expect.objectContaining({
              id: created.id,
              currency_code: "eur",
              customer_id: "cust_02",
            })
          )
        })

        it("should list store credit accounts", async () => {
          await service.createStoreCreditAccounts([
            { currency_code: "usd", customer_id: "cust_03" },
            { currency_code: "usd", customer_id: "cust_04" },
          ])

          const accounts = await service.listStoreCreditAccounts({
            currency_code: "usd",
          })

          expect(accounts.length).toBeGreaterThanOrEqual(2)
        })

        it("should soft delete and restore a store credit account", async () => {
          const account = await service.createStoreCreditAccounts({
            currency_code: "usd",
            customer_id: "cust_05",
          })

          await service.softDeleteStoreCreditAccounts([account.id])

          await expect(
            service.retrieveStoreCreditAccount(account.id)
          ).rejects.toThrow()

          await service.restoreStoreCreditAccounts([account.id])

          const restored = await service.retrieveStoreCreditAccount(account.id)
          expect(restored.id).toEqual(account.id)
        })

        it("should enforce unique customer_id + currency_code constraint", async () => {
          await service.createStoreCreditAccounts({
            currency_code: "usd",
            customer_id: "cust_06",
          })

          await expect(
            service.createStoreCreditAccounts({
              currency_code: "usd",
              customer_id: "cust_06",
            })
          ).rejects.toThrow()
        })
      })

      describe("AccountTransactions", () => {
        it("should credit a store credit account", async () => {
          const account = await service.createStoreCreditAccounts({
            currency_code: "usd",
            customer_id: "cust_07",
          })

          const transactions = await service.creditAccounts([
            {
              account_id: account.id,
              amount: 100,
              reference: "order",
              reference_id: "order_001",
            },
          ])

          expect(transactions).toHaveLength(1)
          expect(transactions[0]).toEqual(
            expect.objectContaining({
              id: expect.stringMatching(/^sc_trx_/),
              amount: 100,
              type: "credit",
              reference: "order",
              reference_id: "order_001",
            })
          )
        })

        it("should debit a store credit account", async () => {
          const account = await service.createStoreCreditAccounts({
            currency_code: "usd",
            customer_id: "cust_08",
          })

          await service.creditAccounts([
            {
              account_id: account.id,
              amount: 200,
              reference: "order",
              reference_id: "order_002",
            },
          ])

          const debitTransactions = await service.debitAccounts([
            {
              account_id: account.id,
              amount: 50,
              reference: "cart",
              reference_id: "cart_001",
            },
          ])

          expect(debitTransactions).toHaveLength(1)
          expect(debitTransactions[0]).toEqual(
            expect.objectContaining({
              amount: 50,
              type: "debit",
              reference: "cart",
              reference_id: "cart_001",
            })
          )
        })

        it("should retrieve correct account stats (balance, credits, debits)", async () => {
          const account = await service.createStoreCreditAccounts({
            currency_code: "usd",
            customer_id: "cust_09",
          })

          await service.creditAccounts([
            {
              account_id: account.id,
              amount: 150,
              reference: "order",
              reference_id: "order_003",
            },
          ])

          await service.debitAccounts([
            {
              account_id: account.id,
              amount: 30,
              reference: "cart",
              reference_id: "cart_002",
            },
          ])

          const stats = await service.retrieveAccountStats({
            account_id: account.id,
          })

          expect(stats).toEqual(
            expect.objectContaining({
              id: account.id,
              credits: 150,
              debits: 30,
              balance: 120,
            })
          )
        })

        it("should list account transactions for a given account", async () => {
          const account = await service.createStoreCreditAccounts({
            currency_code: "usd",
            customer_id: "cust_10",
          })

          await service.creditAccounts([
            {
              account_id: account.id,
              amount: 50,
              reference: "order",
              reference_id: "order_004",
            },
          ])

          await service.debitAccounts([
            {
              account_id: account.id,
              amount: 20,
              reference: "cart",
              reference_id: "cart_003",
            },
          ])

          const transactions = await service.listAccountTransactions({
            account_id: account.id,
          })

          expect(transactions).toHaveLength(2)
        })

        it("should not allow debiting more than the current balance", async () => {
          const account = await service.createStoreCreditAccounts({
            currency_code: "usd",
            customer_id: "cust_12",
          })

          await service.creditAccounts([
            {
              account_id: account.id,
              amount: 40,
              reference: "order",
              reference_id: "order_006",
            },
          ])

          await expect(
            service.debitAccounts([
              {
                account_id: account.id,
                amount: 100,
                reference: "cart",
                reference_id: "cart_004",
              },
            ])
          ).rejects.toThrow()
        })
      })
    })
  },
})