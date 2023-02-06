import { FindOptionsOrder, FindOptionsSelect, In, MoreThan, Not } from "typeorm"
import { addOrderToSelect, buildLegacyFieldsListFrom, buildQuery } from "../build-query"

describe("buildQuery", () => {
  it("successfully creates query", () => {
    const date = new Date()

    const q = buildQuery(
      {
        id: "1234",
        test1: ["123", "12", "1"],
        test2: Not("this"),
        date: { gt: date },
        amount: { gt: 10 },
        rule: {
          type: "fixed"
        }
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
          "items.variants",
          "items.variants.product",
          "items",
          "items.tax_lines",
          "items.adjustments",
        ],
        order: {
          id: "ASC",
          "items.id": "ASC",
          "items.variant.id": "ASC"
        }
      }
    )

    expect(q).toEqual({
      where: {
        id: "1234",
        test1: In(["123", "12", "1"]),
        test2: Not("this"),
        date: MoreThan(date),
        amount: MoreThan(10),
        rule: {
          type: "fixed"
        }
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
        items: {
          variants: {
            product: true
          },
          tax_lines: true,
          adjustments: true
        }
      },
      order: {
        id: "ASC",
        items: {
          id: "ASC",
          variant: {
            id: "ASC"
          }
        }
      }
    })
  })
})

describe("buildLegacyFieldsListFrom", () => {
  it("successfully build back select object shape to list", () => {
    const q = buildLegacyFieldsListFrom({
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
    })

    expect(q.length).toBe(14)
    expect(q).toEqual(expect.arrayContaining([
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
    ]))
  })

  it("successfully build back relation object shape to list", () => {
    const q = buildLegacyFieldsListFrom({
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
      items: {
        variants: {
          product: true
        },
        tax_lines: true,
        adjustments: true
      }
    })

    expect(q.length).toBe(19)
    expect(q).toEqual(expect.arrayContaining([
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
      "items.variants",
      "items.variants.product",
      "items",
      "items.tax_lines",
      "items.adjustments",
    ]))
  })

  it("successfully build back order object shape to list", () => {
    const q = buildLegacyFieldsListFrom({
      id: "ASC",
      items: {
        id: "ASC",
        variant: {
          id: "ASC"
        }
      }
    })

    expect(q.length).toBe(5)
    expect(q).toEqual(expect.arrayContaining([
      "id",
      "items",
      "items.id",
      "items.variant",
      "items.variant.id"
    ]))
  })

  describe('addOrderToSelect', function () {
    it("successfully add the order fields to the select object", () => {
      const select: FindOptionsSelect<any> = {
        item: {
          variant: {
            id: true
          }
        }
      }

      const order: FindOptionsOrder<any> = {
        item: {
          variant: {
            rank: "ASC"
          }
        }
      }

      addOrderToSelect(order, select)

      expect(select).toEqual({
        item: {
          variant: {
            id: true,
            rank: true
          }
        }
      })
    })
  });
})
