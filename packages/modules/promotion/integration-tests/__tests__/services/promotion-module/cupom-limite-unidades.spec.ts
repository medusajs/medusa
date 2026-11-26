import { IPromotionModuleService } from "@medusajs/framework/types"
import {
  Modules,
  PromotionStatus,
  PromotionType,
} from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner, SuiteOptions } from "@medusajs/test-utils"

jest.setTimeout(30000)

const CODIGO_CUPOM = "LEVE2"

function itemCamiseta(quantidade: number, descontavel = true) {
  return {
    id: "item_camiseta",
    quantity: quantidade,
    subtotal: 1000 * quantidade,
    original_total: 1000 * quantidade,
    is_discountable: descontavel,
    product: { id: "prod_camiseta" },
  }
}

function itemCaneca(quantidade: number) {
  return {
    id: "item_caneca",
    quantity: quantidade,
    subtotal: 500 * quantidade,
    original_total: 500 * quantidade,
    is_discountable: true,
    product: { id: "prod_caneca" },
  }
}

moduleIntegrationTestRunner({
  moduleName: Modules.PROMOTION,
  testSuite: ({ service }: SuiteOptions<IPromotionModuleService>) => {
    describe("Jornada: cupom fixo por unidade com limite de unidades", () => {
      async function criarCupom(dados: Record<string, any> = {}) {
        const { application_method = {}, ...promocao } = dados

        return await service.createPromotions({
          code: CODIGO_CUPOM,
          type: PromotionType.STANDARD,
          status: PromotionStatus.ACTIVE,
          ...promocao,
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "each",
            currency_code: "usd",
            value: 300,
            max_quantity: 2,
            ...application_method,
          },
        } as any)
      }

      async function calcularAcoes(items: any[], moeda = "usd") {
        const resultado = await service.computeActions([CODIGO_CUPOM], {
          currency_code: moeda,
          items,
        })

        return JSON.parse(JSON.stringify(resultado))
      }

      it.each([
        [1, 300],
        [2, 600],
        [3, 600],
      ])(
        "deve gerar ajuste de %i unidade(s) com valor %i",
        async (quantidade, valorEsperado) => {
          await criarCupom()

          const acoes = await calcularAcoes([itemCamiseta(quantidade)])

          expect(acoes).toEqual([
            {
              action: "addItemAdjustment",
              item_id: "item_camiseta",
              amount: valorEsperado,
              code: CODIGO_CUPOM,
              is_tax_inclusive: false,
            },
          ])
        }
      )

      it("nao deve aplicar o cupom em item marcado como nao descontavel", async () => {
        await criarCupom()

        const acoes = await calcularAcoes([itemCamiseta(2, false)])

        expect(acoes).toEqual([])
      })

      it("deve aplicar o cupom somente ao produto alvo da regra", async () => {
        await criarCupom({
          application_method: {
            target_rules: [
              {
                attribute: "items.product.id",
                operator: "eq",
                values: ["prod_camiseta"],
              },
            ],
          },
        })

        const acoes = await calcularAcoes([itemCamiseta(3), itemCaneca(1)])

        expect(acoes).toEqual([
          expect.objectContaining({
            action: "addItemAdjustment",
            item_id: "item_camiseta",
            amount: 600,
          }),
        ])
      })

      it("nao deve aplicar o cupom quando a moeda do carrinho e diferente da moeda do cupom", async () => {
        await criarCupom()

        const acoes = await calcularAcoes([itemCamiseta(2)], "eur")

        expect(acoes).toEqual([])
      })

      it("nao deve aplicar o cupom quando ele esta em rascunho", async () => {
        await criarCupom({ status: PromotionStatus.DRAFT })

        const acoes = await calcularAcoes([itemCamiseta(2)])

        expect(acoes).toEqual([])
      })

      it("nao deve aplicar o cupom quando ele ja expirou", async () => {
        await criarCupom({
          campaign: {
            name: "Campanha encerrada",
            campaign_identifier: "campanha-encerrada",
            starts_at: new Date("2020-01-01"),
            ends_at: new Date("2020-12-31"),
          },
        })

        const acoes = await calcularAcoes([itemCamiseta(2)])

        expect(acoes).toEqual([])
      })

      it("deve sinalizar limite excedido quando o cupom ja atingiu o numero maximo de usos", async () => {
        await criarCupom({ limit: 1 })

        const primeiraCompra = await calcularAcoes([itemCamiseta(2)])

        await service.registerUsage(primeiraCompra, {
          customer_id: null,
          customer_email: null,
        })

        const segundaCompra = await calcularAcoes([itemCamiseta(2)])

        expect(segundaCompra).toEqual([
          {
            action: "promotionLimitExceeded",
            code: CODIGO_CUPOM,
          },
        ])
      })
    })
  },
})
