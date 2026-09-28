import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { Modules } from "@medusajs/framework/utils"
import { createStep, createWorkflow } from "@medusajs/workflows-sdk"

import { upsertTaxLinesForItemsStep } from "../upsert-tax-lines-for-items"

const ITEM_ID = "litem_1"

/**
 * An in-memory stand-in for the parts of the Cart Module this step touches.
 * `upsertLineItemTaxLines` reproduces the module's own semantics: an entry with
 * an `id` updates that row, an entry without one inserts a new row.
 */
const cartServiceFixture = () => {
  let sequence = 0
  const rows: { id: string; item_id: string; rate: number; code: string }[] = []

  return {
    rows,
    listLineItemTaxLines: jest.fn(async (filters: any) => {
      const itemIds = ([] as string[]).concat(filters.item_id ?? [])
      // The module serializes what it returns, so a caller holding on to the
      // result (the step's compensation snapshot) is unaffected by later writes.
      return rows
        .filter((row) => itemIds.includes(row.item_id))
        .map((row) => ({ ...row }))
    }),
    listShippingMethodTaxLines: jest.fn(async () => []),
    upsertLineItemTaxLines: jest.fn(async (taxLines: any[]) => {
      for (const taxLine of taxLines) {
        const existing = taxLine.id && rows.find((row) => row.id === taxLine.id)

        if (existing) {
          Object.assign(existing, taxLine)
        } else {
          rows.push({ ...taxLine, id: `calitxl_${++sequence}` })
        }
      }
    }),
    upsertShippingMethodTaxLines: jest.fn(async () => {}),
    addLineItemTaxLines: jest.fn(async (taxLines: any[]) => {
      for (const taxLine of taxLines) {
        rows.push({ ...taxLine, id: `calitxl_${++sequence}` })
      }
    }),
    addShippingMethodTaxLines: jest.fn(async () => {}),
    deleteLineItemTaxLines: jest.fn(async (ids: string[]) => {
      for (const id of ids) {
        const index = rows.findIndex((row) => row.id === id)

        if (index > -1) {
          rows.splice(index, 1)
        }
      }
    }),
    deleteShippingMethodTaxLines: jest.fn(async () => {}),
  }
}

const failingStep = createStep("upsert-tax-lines-test-failure", async () => {
  throw new Error("downstream failure")
})

describe("upsertTaxLinesForItemsStep", () => {
  let container!: MedusaContainer
  let cartService!: ReturnType<typeof cartServiceFixture>

  const prescottAz = () =>
    [
      { code: "AZ_STATE", rate: 5.6 },
      { code: "AZ_COUNTY", rate: 0.75 },
      { code: "AZ_CITY", rate: 2.95 },
    ].map((line) => ({
      ...line,
      name: `zamp-${line.code}`,
      provider_id: "tp_zamp",
      line_item_id: ITEM_ID,
    }))

  const workflow = createWorkflow(
    "upsert-tax-lines-for-items-compensation-test",
    (input: any) => {
      upsertTaxLinesForItemsStep({
        cart: input.cart,
        item_tax_lines: input.item_tax_lines,
        shipping_tax_lines: [],
      })

      failingStep()
    }
  )

  const runAndFail = async () => {
    await workflow(container).run({
      input: {
        cart: { id: "cart_1", items: [{ id: ITEM_ID }] },
        item_tax_lines: prescottAz(),
      },
      throwOnError: false,
    })
  }

  beforeEach(() => {
    cartService = cartServiceFixture()
    container = createContainer() as unknown as MedusaContainer
    container.register(
      Modules.CART,
      asFunction(() => cartService as any)
    )
  })

  it("leaves an item's tax lines untouched when the workflow fails after the step", async () => {
    await cartService.upsertLineItemTaxLines(
      prescottAz().map(({ code, rate }) => ({ item_id: ITEM_ID, code, rate }))
    )
    const before = cartService.rows.map((row) => `${row.code}@${row.rate}`)

    // A multi-rate jurisdiction is the case that regressed: three incoming tax
    // lines against three existing rows.
    for (const _ of [1, 2, 3]) {
      await runAndFail()

      expect(cartService.rows.map((row) => `${row.code}@${row.rate}`).sort()).toEqual(
        before.sort()
      )
    }
  })

  it("removes the tax lines it inserted for an item that had none", async () => {
    await runAndFail()

    expect(cartService.rows).toEqual([])
  })
})
