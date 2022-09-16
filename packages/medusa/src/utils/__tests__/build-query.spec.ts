import { In, Not } from "typeorm"
import { buildQuery } from "../build-query"

describe("buildQuery", () => {
  describe("buildQuery_", () => {
    it("successfully creates query", () => {
      const q = buildQuery(
        {
          id: "1234",
          test1: ["123", "12", "1"],
          test2: Not("this"),
        },
        {
          select: [
            "order",
            "order.items",
            "order.swaps",
            "order.swaps.additional_items",
            "order.discounts",
            "order.discounts.rule",
            "order.claims",
            "order.claims.additional_items",
            "additional_items",
            "additional_items.variant",
            "return_order",
            "return_order.items",
            "return_order.shipping_method",
            "return_order.shipping_method.tax_lines",
          ],
          relations: [
            "order",
            "order.items",
            "order.swaps",
            "order.swaps.additional_items",
            "order.discounts",
            "order.discounts.rule",
            "order.claims",
            "order.claims.additional_items",
            "additional_items",
            "additional_items.variant",
            "return_order",
            "return_order.items",
            "return_order.shipping_method",
            "return_order.shipping_method.tax_lines",
          ],
        }
      )

      expect(q).toEqual({
        where: {
          id: "1234",
          test1: In(["123", "12", "1"]),
          test2: Not("this"),
        },
        select: {
          order: {
            items: true,
            swaps: {
              additional_items: true,
            },
            discounts: {
              rule: true,
            },
            claims: {
              additional_items: true,
            },
          },
          additional_items: {
            variant: true,
          },
          return_order: {
            items: true,
            shipping_method: {
              tax_lines: true,
            },
          },
        },
        relations: {
          order: {
            items: true,
            swaps: {
              additional_items: true,
            },
            discounts: {
              rule: true,
            },
            claims: {
              additional_items: true,
            },
          },
          additional_items: {
            variant: true,
          },
          return_order: {
            items: true,
            shipping_method: {
              tax_lines: true,
            },
          },
        },
      })
    })
  })
})
