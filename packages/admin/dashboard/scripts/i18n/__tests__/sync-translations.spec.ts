import { describe, expect, test } from "vitest"

import {
  findMissing,
  getPlaceholders,
  mergeLevel,
} from "../sync-translations.js"

const en = {
  $schema: "./$schema.json",
  general: {
    save: "Save",
    cancel: "Cancel",
    items_one: "{{count}} item",
    items_other: "{{count}} items",
  },
  orders: {
    title: "Orders",
    status: {
      pending: "Pending",
      paid: "Paid",
    },
  },
}

function merge(localeObj: any, translated: any, forms = ["one", "other"]) {
  const errors: string[] = []
  const result = mergeLevel(en, localeObj, translated, forms, [], errors)
  return { result, errors }
}

describe("getPlaceholders", () => {
  test("returns sorted i18next placeholders and Trans tags", () => {
    expect(
      getPlaceholders("Available in <0>{{ x }}</0> of <1>{{y}}</1><2/>", false)
    ).toEqual(["</0>", "</1>", "<0>", "<1>", "<2/>", "{{x}}", "{{y}}"])
  })

  test("ignores {{count}} for plural keys only", () => {
    expect(getPlaceholders("{{count}} of {{name}}", true)).toEqual(["{{name}}"])
    expect(getPlaceholders("{{count}} of {{name}}", false)).toEqual([
      "{{count}}",
      "{{name}}",
    ])
  })
})

describe("findMissing", () => {
  test("returns nothing when the locale is complete", () => {
    const locale = {
      $schema: "./$schema.json",
      general: {
        save: "Speichern",
        cancel: "Abbrechen",
        items_one: "{{count}} Artikel",
        items_other: "{{count}} Artikel",
      },
      orders: {
        title: "Bestellungen",
        status: { pending: "Ausstehend", paid: "Bezahlt" },
      },
    }

    expect(findMissing(en, locale, ["one", "other"])).toEqual({
      missing: {},
      count: 0,
    })
  })

  test("returns missing leaves and whole missing sections with English values", () => {
    const locale = {
      general: {
        save: "Speichern",
        cancel: "",
        items_one: "{{count}} Artikel",
      },
    }

    expect(findMissing(en, locale, ["one", "other"])).toEqual({
      missing: {
        general: { cancel: "Cancel", items_other: "{{count}} items" },
        orders: {
          title: "Orders",
          status: { pending: "Pending", paid: "Paid" },
        },
      },
      count: 5,
    })
  })

  test("expands plural groups to the locale's forms using _other as the source", () => {
    const locale = {
      general: { save: "Zapisz", cancel: "Anuluj" },
      orders: {
        title: "Zamówienia",
        status: { pending: "Oczekuje", paid: "Opłacone" },
      },
    }

    expect(
      findMissing(en, locale, ["one", "few", "many", "other"]).missing
    ).toEqual({
      general: {
        items_one: "{{count}} item",
        items_few: "{{count}} items",
        items_many: "{{count}} items",
        items_other: "{{count}} items",
      },
    })
  })

  test("drops English plural forms the locale doesn't use", () => {
    const locale = {
      general: { save: "保存", cancel: "取消" },
      orders: { title: "订单", status: { pending: "待处理", paid: "已支付" } },
    }

    expect(findMissing(en, locale, ["other"]).missing).toEqual({
      general: { items_other: "{{count}} items" },
    })
  })

  test("treats a string where en has an object as missing the whole section", () => {
    const locale = {
      general: {
        save: "Speichern",
        cancel: "Abbrechen",
        items_one: "{{count}} Artikel",
        items_other: "{{count}} Artikel",
      },
      orders: { title: "Bestellungen", status: "Status" },
    }

    expect(findMissing(en, locale, ["one", "other"])).toEqual({
      missing: { orders: { status: { pending: "Pending", paid: "Paid" } } },
      count: 2,
    })
  })
})

describe("mergeLevel", () => {
  test("inserts new keys after their closest preceding en.json sibling", () => {
    const locale = {
      $schema: "./$schema.json",
      general: { cancel: "Abbrechen", extra: "Veraltet" },
      orders: { status: { paid: "Bezahlt" } },
    }

    const { result, errors } = merge(locale, {
      general: { save: "Speichern", items_other: "{{count}} Artikel" },
      orders: { title: "Bestellungen", status: { pending: "Ausstehend" } },
    })

    expect(errors).toEqual([])
    expect(Object.keys(result)).toEqual(["$schema", "general", "orders"])
    expect(Object.keys(result.general)).toEqual([
      "save",
      "cancel",
      "items_other",
      "extra",
    ])
    expect(result.orders).toEqual({
      title: "Bestellungen",
      status: { pending: "Ausstehend", paid: "Bezahlt" },
    })
    expect(Object.keys(result.orders)).toEqual(["title", "status"])
    expect(Object.keys(result.orders.status)).toEqual(["pending", "paid"])
  })

  test("keeps $schema first when inserting at the start", () => {
    const { result } = merge(
      { $schema: "./$schema.json", orders: { title: "Bestellungen" } },
      { general: { save: "Speichern" } }
    )

    expect(Object.keys(result)).toEqual(["$schema", "general", "orders"])
  })

  test("creates sections that don't exist in the locale", () => {
    const { result, errors } = merge(
      {},
      { orders: { status: { pending: "Ausstehend" } } }
    )

    expect(errors).toEqual([])
    expect(result).toEqual({ orders: { status: { pending: "Ausstehend" } } })
  })

  test("accepts plural forms English doesn't have", () => {
    const { result, errors } = merge(
      { general: { items_one: "{{count}} element" } },
      {
        general: {
          items_few: "{{count}} elementy",
          items_many: "{{count}} elementów",
        },
      },
      ["one", "few", "many", "other"]
    )

    expect(errors).toEqual([])
    expect(result.general).toEqual({
      items_one: "{{count}} element",
      items_few: "{{count}} elementy",
      items_many: "{{count}} elementów",
    })
  })

  test("allows plural forms to drop {{count}}", () => {
    const { result, errors } = merge(
      {},
      { general: { items_one: "Ein Artikel" } }
    )

    expect(errors).toEqual([])
    expect(result.general.items_one).toBe("Ein Artikel")
  })

  test("rejects keys that aren't in en.json or the locale's plural forms", () => {
    const { result, errors } = merge(
      {},
      { general: { save: "Speichern", unknown: "x", items_few: "y" } }
    )

    expect(errors).toEqual([
      'Unknown key "general.unknown"',
      'Unknown key "general.items_few"',
    ])
    expect(result).toEqual({ general: { save: "Speichern" } })
  })

  test("never overwrites existing translations", () => {
    const { result, errors } = merge(
      { general: { save: "Speichern" } },
      { general: { save: "Sichern" } }
    )

    expect(errors).toEqual(['"general.save" is already translated'])
    expect(result.general.save).toBe("Speichern")
  })

  test("rejects placeholder and Trans tag mismatches", () => {
    const errors: string[] = []
    const result = mergeLevel(
      { a: "Hi {{name}}", b: "Click <0>here</0>" },
      {},
      { a: "Hallo {{nom}}", b: "Klicke hier" },
      ["one", "other"],
      [],
      errors
    )

    expect(errors).toEqual([
      'Placeholder mismatch at "a": expected [{{name}}], got [{{nom}}]',
      'Placeholder mismatch at "b": expected [</0>,<0>], got []',
    ])
    expect(result).toEqual({})
  })

  test("rejects empty strings and wrong value types", () => {
    const { result, errors } = merge(
      {},
      {
        general: { save: " ", cancel: { nested: "x" } },
        orders: "Bestellungen",
      }
    )

    expect(errors).toEqual([
      'Expected a non-empty string at "general.save"',
      'Expected a non-empty string at "general.cancel"',
      'Expected an object at "orders"',
    ])
    expect(result).toEqual({})
  })

  test("merges output split across multiple parts", () => {
    const first = merge({}, { general: { cancel: "Abbrechen" } })
    const second = merge(first.result, { general: { save: "Speichern" } })

    expect(second.errors).toEqual([])
    expect(Object.keys(second.result.general)).toEqual(["save", "cancel"])
  })
})
