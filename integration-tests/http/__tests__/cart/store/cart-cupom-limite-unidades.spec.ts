import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ProductStatus, PromotionStatus, PromotionType } from "@medusajs/utils"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(100000)

const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Jornada: cliente compra com cupom fixo limitado a 2 unidades", () => {
      let appContainer
      let storeHeaders
      let region
      let salesChannel
      let variante
      let cupom

      beforeEach(async () => {
        appContainer = getContainer()
        await createAdminUser(dbConnection, adminHeaders, appContainer)
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "Loja online" },
            adminHeaders
          )
        ).data.sales_channel

        region = (
          await api.post(
            "/admin/regions",
            {
              name: "EUA",
              currency_code: "usd",
              countries: ["us"],
              automatic_taxes: false,
              payment_providers: ["pp_system_default"],
            },
            adminHeaders
          )
        ).data.region

        const produto = (
          await api.post(
            "/admin/products",
            {
              title: "Camiseta",
              status: ProductStatus.PUBLISHED,
              options: [{ title: "Tamanho", values: ["M"] }],
              variants: [
                {
                  title: "M",
                  options: { Tamanho: "M" },
                  manage_inventory: false,
                  prices: [{ amount: 1000, currency_code: "usd" }],
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        variante = produto.variants[0]

        cupom = (
          await api.post(
            "/admin/promotions",
            {
              code: "LEVE2",
              type: PromotionType.STANDARD,
              status: PromotionStatus.ACTIVE,
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "each",
                currency_code: "usd",
                value: 300,
                max_quantity: 2,
              },
            },
            adminHeaders
          )
        ).data.promotion
      })

      async function criarCarrinho(quantidade: number) {
        return (
          await api.post(
            "/store/carts",
            {
              currency_code: "usd",
              region_id: region.id,
              sales_channel_id: salesChannel.id,
              email: "cliente@teste.com",
              items: [{ variant_id: variante.id, quantity: quantidade }],
            },
            storeHeaders
          )
        ).data.cart
      }

      async function aplicarCupom(carrinho) {
        return (
          await api.post(
            `/store/carts/${carrinho.id}/promotions`,
            { promo_codes: [cupom.code] },
            storeHeaders
          )
        ).data.cart
      }

      async function alterarQuantidade(carrinho, quantidade: number) {
        return (
          await api.post(
            `/store/carts/${carrinho.id}/line-items/${carrinho.items[0].id}`,
            { quantity: quantidade },
            storeHeaders
          )
        ).data.cart
      }

      it("deve recalcular o desconto ao aumentar a quantidade e finalizar o pedido respeitando o limite de 2 unidades", async () => {
        let carrinho = await criarCarrinho(1)

        carrinho = await aplicarCupom(carrinho)

        expect(carrinho).toEqual(
          expect.objectContaining({
            discount_total: 300,
            total: 700,
            promotions: [expect.objectContaining({ code: "LEVE2" })],
          })
        )

        carrinho = await alterarQuantidade(carrinho, 2)

        expect(carrinho).toEqual(
          expect.objectContaining({ discount_total: 600, total: 1400 })
        )

        carrinho = await alterarQuantidade(carrinho, 3)

        expect(carrinho).toEqual(
          expect.objectContaining({ discount_total: 600, total: 2400 })
        )

        const colecaoPagamento = (
          await api.post(
            "/store/payment-collections",
            { cart_id: carrinho.id },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${colecaoPagamento.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeaders
        )

        const finalizacao = await api.post(
          `/store/carts/${carrinho.id}/complete`,
          {},
          storeHeaders
        )

        expect(finalizacao.status).toEqual(200)
        expect(finalizacao.data.type).toEqual("order")

        const pedido = (
          await api.get(
            `/store/orders/${finalizacao.data.order.id}`,
            storeHeaders
          )
        ).data.order

        expect(pedido).toEqual(
          expect.objectContaining({
            discount_total: 600,
            total: 2400,
            items: [
              expect.objectContaining({
                quantity: 3,
                unit_price: 1000,
                adjustments: [
                  expect.objectContaining({ code: "LEVE2", amount: 600 }),
                ],
              }),
            ],
          })
        )
      })

      it("deve reduzir o desconto quando o cliente diminui a quantidade abaixo do limite", async () => {
        let carrinho = await criarCarrinho(3)

        carrinho = await aplicarCupom(carrinho)

        expect(carrinho).toEqual(
          expect.objectContaining({ discount_total: 600, total: 2400 })
        )

        carrinho = await alterarQuantidade(carrinho, 1)

        expect(carrinho).toEqual(
          expect.objectContaining({ discount_total: 300, total: 700 })
        )
      })

      it("deve restaurar o valor cheio quando o cliente remove o cupom do carrinho", async () => {
        let carrinho = await aplicarCupom(await criarCarrinho(2))

        expect(carrinho.discount_total).toEqual(600)

        await api.delete(`/store/carts/${carrinho.id}/promotions`, {
          data: { promo_codes: [cupom.code] },
          ...storeHeaders,
        })

        carrinho = (await api.get(`/store/carts/${carrinho.id}`, storeHeaders))
          .data.cart

        expect(carrinho).toEqual(
          expect.objectContaining({
            discount_total: 0,
            total: 2000,
            promotions: [],
          })
        )
      })
    })
  },
})
