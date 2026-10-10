import { describe, expect, it } from "vitest"
import type { HttpTypes } from "@medusajs/types"
import {
  buildLocaleSnapshot,
  computeChanges,
  copyTranslationField,
  extendSnapshot,
  snapshotToFormValues,
} from "./translation-form-utils"

const existing: HttpTypes.AdminTranslation = {
  id: "tr_1",
  reference_id: "product_1",
  reference: "product",
  locale_code: "pl-PL",
  translations: { title: "Old title", description: "Keep this" },
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  deleted_at: null,
}

const references = [{ id: "product_1" }, { id: "product_2" }]
const fields = ["title", "description"]
const snapshot = () =>
  buildLocaleSnapshot([existing], references, "pl-PL", fields)

describe("bulk translation editing", () => {
  it("copies the selected field across pages while preserving other fields and IDs", () => {
    const baseline = extendSnapshot(
      snapshot(),
      [],
      [{ id: "product_3" }],
      fields
    )
    const values = snapshotToFormValues(baseline)
    const changes = copyTranslationField(values, "title", "Shared title", false)
    expect(changes).toHaveLength(3)
    for (const change of changes) {
      values.entities[change.referenceId].fields.title = change.after
    }
    const result = computeChanges(values, baseline, "product", "pl-PL")
    expect(result.payload.create).toHaveLength(2)
    expect(result.payload.update).toEqual([
      {
        id: "tr_1",
        translations: { title: "Shared title", description: "Keep this" },
      },
    ])
    expect(
      result.payload.create.every((item) => item.locale_code === "pl-PL")
    ).toBe(true)
    expect(baseline.entities.product_1.fields.title).toBe("Old title")
  })

  it("fills only blank fields and leaves existing text untouched", () => {
    const values = snapshotToFormValues(snapshot())
    values.entities.product_2.fields.title = "  "
    expect(copyTranslationField(values, "title", "New", true)).toEqual([
      { referenceId: "product_2", before: "  ", after: "New" },
    ])
    expect(values.entities.product_1.fields.title).toBe("Old title")
  })

  it("ignores unchanged values and fields that do not belong to a row", () => {
    const values = snapshotToFormValues(snapshot())
    delete values.entities.product_2.fields.title
    expect(copyTranslationField(values, "title", "Old title", false)).toEqual(
      []
    )
  })

  it("allows clearing one field without deleting other translations", () => {
    const baseline = snapshot()
    const values = snapshotToFormValues(baseline)
    values.entities.product_1.fields.title = ""
    const result = computeChanges(values, baseline, "product", "pl-PL")
    expect(result.payload.delete).toEqual([])
    expect(result.payload.update[0].translations).toEqual({
      title: "",
      description: "Keep this",
    })
  })

  it("deletes an existing translation only when all fields are cleared", () => {
    const baseline = snapshot()
    const values = snapshotToFormValues(baseline)
    values.entities.product_1.fields = { title: "", description: "" }
    expect(
      computeChanges(values, baseline, "product", "pl-PL").payload
    ).toEqual({
      create: [],
      update: [],
      delete: ["tr_1"],
    })
  })

  it("keeps the correct language and does not replace a baseline when extending pages", () => {
    const baseline = snapshot()
    const otherLocale = { ...existing, id: "tr_en", locale_code: "en-US" }
    expect(
      buildLocaleSnapshot([otherLocale], references, "pl-PL", fields).entities
        .product_1.id
    ).toBeNull()
    const extended = extendSnapshot(
      baseline,
      [{ ...existing, translations: { title: "Server changed" } }],
      references,
      fields
    )
    expect(extended.entities.product_1.fields.title).toBe("Old title")
  })

  it("detects edits after saving without mutating the saved baseline", () => {
    const baseline = snapshot()
    const values = snapshotToFormValues(baseline)
    expect(
      computeChanges(values, baseline, "product", "pl-PL").hasChanges
    ).toBe(false)
    values.entities.product_1.fields.title = "Edited"
    expect(
      computeChanges(values, baseline, "product", "pl-PL").hasChanges
    ).toBe(true)
  })
})
