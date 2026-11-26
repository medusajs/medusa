import { calculateAdjustmentAmountFromPromotion } from "../index"
import { MathBN } from "../../math"

const PRECO_UNITARIO = 1000

function criarItem(quantidade: number) {
  return {
    quantity: quantidade,
    subtotal: PRECO_UNITARIO * quantidade,
    original_total: PRECO_UNITARIO * quantidade,
  }
}

function cupomFixoPorUnidade(valor: number, maxQuantity?: number) {
  return {
    type: "fixed",
    allocation: "each",
    value: valor,
    max_quantity: maxQuantity,
    applied_value: 0,
    is_tax_inclusive: false,
  }
}

function calcular(item: any, cupom: any, totalDosItens = 0) {
  return MathBN.convert(
    calculateAdjustmentAmountFromPromotion(item, cupom, totalDosItens)
  ).toNumber()
}

describe("calculateAdjustmentAmountFromPromotion - cupom fixo por unidade com limite de unidades", () => {
  describe("valores-limite da quantidade em relacao ao max_quantity = 2", () => {
    it.each([
      [1, 300],
      [2, 600],
      [3, 600],
      [10, 600],
    ])(
      "quantidade %i deve gerar desconto de %i",
      (quantidade, descontoEsperado) => {
        const desconto = calcular(
          criarItem(quantidade),
          cupomFixoPorUnidade(300, 2)
        )

        expect(desconto).toEqual(descontoEsperado)
      }
    )
  })

  describe("valor do cupom em relacao ao preco unitario", () => {
    it.each([
      [999, 999],
      [1000, 1000],
      [1500, 1000],
    ])(
      "cupom de %i em um item de 1000 deve gerar desconto de %i",
      (valorCupom, descontoEsperado) => {
        const desconto = calcular(
          criarItem(1),
          cupomFixoPorUnidade(valorCupom, 2)
        )

        expect(desconto).toEqual(descontoEsperado)
      }
    )

    it("deve limitar o desconto ao valor das unidades permitidas quando o cupom excede o preco", () => {
      const desconto = calcular(criarItem(3), cupomFixoPorUnidade(1500, 2))

      expect(desconto).toEqual(2000)
    })
  })

  describe("descontos ja aplicados ao item", () => {
    it("deve aplicar o desconto integral quando ainda ha saldo suficiente no item", () => {
      const cupom = { ...cupomFixoPorUnidade(300, 2), applied_value: 500 }

      expect(calcular(criarItem(2), cupom)).toEqual(600)
    })

    it("deve aplicar apenas o saldo restante quando o item esta quase todo descontado", () => {
      const cupom = { ...cupomFixoPorUnidade(300, 2), applied_value: 1800 }

      expect(calcular(criarItem(2), cupom)).toEqual(200)
    })

    it("nao deve gerar desconto quando o item ja esta totalmente descontado", () => {
      const cupom = { ...cupomFixoPorUnidade(300, 2), applied_value: 2000 }

      expect(calcular(criarItem(2), cupom)).toEqual(0)
    })
  })

  describe("ausencia de max_quantity", () => {
    it("deve considerar apenas uma unidade quando max_quantity nao e informado", () => {
      const desconto = calcular(criarItem(3), cupomFixoPorUnidade(300))

      expect(desconto).toEqual(300)
    })
  })

  describe("cupom percentual com limite de unidades", () => {
    it("deve aplicar o percentual apenas sobre as unidades permitidas", () => {
      const cupom = {
        ...cupomFixoPorUnidade(10, 2),
        type: "percentage",
      }

      expect(calcular(criarItem(3), cupom)).toEqual(200)
    })
  })

  describe("cupom fixo distribuido entre itens (across)", () => {
    it("deve distribuir o desconto proporcionalmente ao valor do item", () => {
      const cupom = {
        ...cupomFixoPorUnidade(300),
        allocation: "across",
      }

      expect(calcular(criarItem(1), cupom, 4000)).toEqual(75)
    })
  })
})
