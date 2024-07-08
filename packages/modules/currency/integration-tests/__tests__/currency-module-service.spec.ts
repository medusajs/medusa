import { ICurrencyModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner } from "medusa-test-utils"
import { Module, Modules } from "@medusajs/utils"
import { CurrencyModuleService } from "@services"

jest.setTimeout(100000)

moduleIntegrationTestRunner<ICurrencyModuleService>({
  moduleName: Modules.CURRENCY,
  testSuite: ({ service }) => {
    describe("Currency Module Service", () => {
      it(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.CURRENCY, {
          service: CurrencyModuleService,
        }).linkable

        expect(Object.keys(linkable)).toEqual(["currency"])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({
          currency: {
            code: {
              linkable: "currency_code",
              primaryKey: "code",
              serviceName: "currency",
              field: "currency",
            },
          },
        })
      })

      describe("list", () => {
        it("list currencies", async () => {
          const currenciesResult = await service.listCurrencies(
            {},
            { take: null }
          )
          expect(currenciesResult).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                code: "cad",
                name: "Canadian Dollar",
                decimal_digits: 2,
              }),
              expect.objectContaining({
                code: "usd",
                name: "US Dollar",
                decimal_digits: 2,
              }),
            ])
          )
        })

        it("list currencies by code", async () => {
          const currenciesResult = await service.listCurrencies(
            { code: ["usd"] },
            { take: null }
          )

          expect(currenciesResult).toEqual([
            expect.objectContaining({
              code: "usd",
              name: "US Dollar",
            }),
          ])
        })

        it("list currencies by code regardless of case-sensitivity", async () => {
          const currenciesResult = await service.listCurrencies(
            { code: ["Usd"] },
            { take: null }
          )

          expect(currenciesResult).toEqual([
            expect.objectContaining({
              code: "usd",
              name: "US Dollar",
            }),
          ])
        })
      })

      describe("listAndCountCurrenciesCurrencies", () => {
        it("should return currencies and count", async () => {
          const [currenciesResult, count] =
            await service.listAndCountCurrencies({}, { take: null })

          expect(count).toEqual(120)
          expect(currenciesResult).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                code: "cad",
                name: "Canadian Dollar",
              }),
              expect.objectContaining({
                code: "usd",
                name: "US Dollar",
              }),
            ])
          )
        })

        it("should return currencies and count when filtered", async () => {
          const [currenciesResult, count] =
            await service.listAndCountCurrencies(
              {
                code: ["usd"],
              },
              { take: null }
            )

          expect(count).toEqual(1)
          expect(currenciesResult).toEqual([
            expect.objectContaining({
              code: "usd",
              name: "US Dollar",
            }),
          ])
        })

        it("should return currencies and count when using skip and take", async () => {
          const [currenciesResult, count] =
            await service.listAndCountCurrencies({}, { skip: 5, take: 1 })

          expect(count).toEqual(120)
          expect(currenciesResult).toEqual([
            expect.objectContaining({
              code: "aud",
              name: "Australian Dollar",
            }),
          ])
        })

        it("should return requested fields", async () => {
          const [currenciesResult, count] =
            await service.listAndCountCurrencies(
              {},
              {
                take: 1,
                select: ["code", "rounding"],
              }
            )

          const serialized = JSON.parse(JSON.stringify(currenciesResult))

          expect(count).toEqual(120)
          expect(serialized).toEqual([
            {
              code: "aed",
              rounding: 0,
              raw_rounding: expect.any(Object),
            },
          ])
        })
      })

      describe("retrieve", () => {
        const code = "usd"
        const name = "US Dollar"

        it("should return currency for the given code", async () => {
          const currency = await service.retrieveCurrency(code)

          expect(currency).toEqual(
            expect.objectContaining({
              code,
            })
          )
        })

        it("should return currency for the given code in a case-insensitive manner", async () => {
          const currency = await service.retrieveCurrency(code.toUpperCase())

          expect(currency).toEqual(
            expect.objectContaining({
              code,
            })
          )
        })

        it("should throw an error when currency with code does not exist", async () => {
          let error

          try {
            await service.retrieveCurrency("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "Currency with code: does-not-exist was not found"
          )
        })

        it("should throw an error when a code is not provided", async () => {
          let error

          try {
            await service.retrieveCurrency(undefined as unknown as string)
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual("currency - code must be defined")
        })

        it("should return currency based on config select param", async () => {
          const currency = await service.retrieveCurrency(code, {
            select: ["code", "name"],
          })

          const serialized = JSON.parse(JSON.stringify(currency))

          expect(serialized).toEqual({
            code,
            name,
          })
        })
      })
    })
  },
})
