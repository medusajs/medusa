import {
  isOperatorMap,
  matchesFilters,
} from "../cross-module-joins/in-memory-filter"

describe("matchesFilters (stage 2 in-memory cross-module filtering)", () => {
  describe("basics", () => {
    it("matches everything on an empty filters object (existence check)", () => {
      expect(matchesFilters({ id: "1" }, {})).toBe(true)
    })

    it("rejects non-record values", () => {
      expect(matchesFilters(null, { id: "1" })).toBe(false)
      expect(matchesFilters(undefined, { id: "1" })).toBe(false)
      expect(matchesFilters("record", { id: "1" })).toBe(false)
      expect(matchesFilters([{ id: "1" }], { id: "1" })).toBe(false)
    })

    it("matches direct scalar equality", () => {
      const record = { title: "Shirt", quantity: 2, active: true }

      expect(matchesFilters(record, { title: "Shirt" })).toBe(true)
      expect(matchesFilters(record, { title: "Pants" })).toBe(false)
      expect(matchesFilters(record, { quantity: 2 })).toBe(true)
      expect(matchesFilters(record, { active: true })).toBe(true)
      expect(matchesFilters(record, { active: false })).toBe(false)
    })

    it("combines multiple field conditions with AND semantics", () => {
      const record = { title: "Shirt", status: "published" }

      expect(
        matchesFilters(record, { title: "Shirt", status: "published" })
      ).toBe(true)
      expect(matchesFilters(record, { title: "Shirt", status: "draft" })).toBe(
        false
      )
    })

    it("treats array conditions as implicit $in", () => {
      const record = { status: "published" }

      expect(matchesFilters(record, { status: ["draft", "published"] })).toBe(
        true
      )
      expect(matchesFilters(record, { status: ["draft", "rejected"] })).toBe(
        false
      )
    })

    it("matches null conditions against null and missing values", () => {
      expect(matchesFilters({ deleted_at: null }, { deleted_at: null })).toBe(
        true
      )
      expect(matchesFilters({}, { deleted_at: null })).toBe(true)
      expect(matchesFilters({ deleted_at: "x" }, { deleted_at: null })).toBe(
        false
      )
    })
  })

  describe("comparison operators", () => {
    const record = { amount: 100 }

    it("evaluates $eq and $ne", () => {
      expect(matchesFilters(record, { amount: { $eq: 100 } })).toBe(true)
      expect(matchesFilters(record, { amount: { $eq: 99 } })).toBe(false)
      expect(matchesFilters(record, { amount: { $ne: 99 } })).toBe(true)
      expect(matchesFilters(record, { amount: { $ne: 100 } })).toBe(false)
    })

    it("evaluates $in and $nin", () => {
      expect(matchesFilters(record, { amount: { $in: [50, 100] } })).toBe(true)
      expect(matchesFilters(record, { amount: { $in: [50, 60] } })).toBe(false)
      expect(matchesFilters(record, { amount: { $nin: [50, 60] } })).toBe(true)
      expect(matchesFilters(record, { amount: { $nin: [50, 100] } })).toBe(
        false
      )
    })

    it("evaluates range operators including boundaries", () => {
      expect(matchesFilters(record, { amount: { $gt: 99 } })).toBe(true)
      expect(matchesFilters(record, { amount: { $gt: 100 } })).toBe(false)
      expect(matchesFilters(record, { amount: { $gte: 100 } })).toBe(true)
      expect(matchesFilters(record, { amount: { $lt: 101 } })).toBe(true)
      expect(matchesFilters(record, { amount: { $lt: 100 } })).toBe(false)
      expect(matchesFilters(record, { amount: { $lte: 100 } })).toBe(true)
      expect(matchesFilters(record, { amount: { $gt: 50, $lte: 100 } })).toBe(
        true
      )
      expect(matchesFilters(record, { amount: { $gt: 50, $lte: 99 } })).toBe(
        false
      )
    })

    it("compares numeric strings numerically (DB numerics)", () => {
      const numeric = { amount: "150.50" }

      expect(matchesFilters(numeric, { amount: { $gt: 100 } })).toBe(true)
      // A lexicographic comparison would put "99" after "150.50".
      expect(matchesFilters(numeric, { amount: { $gt: "99" } })).toBe(true)
      expect(matchesFilters(numeric, { amount: { $lt: 100 } })).toBe(false)
    })

    it("compares dates across Date and ISO string representations", () => {
      const record = { created_at: new Date("2026-01-15T00:00:00Z") }

      expect(
        matchesFilters(record, { created_at: { $gt: "2026-01-01T00:00:00Z" } })
      ).toBe(true)
      expect(
        matchesFilters(record, {
          created_at: { $lt: new Date("2026-01-01T00:00:00Z") },
        })
      ).toBe(false)
      expect(
        matchesFilters(record, { created_at: "2026-01-15T00:00:00.000Z" })
      ).toBe(true)
      expect(
        matchesFilters(
          { created_at: "2026-01-15T00:00:00.000Z" },
          { created_at: { $gte: new Date("2026-01-15T00:00:00Z") } }
        )
      ).toBe(true)
    })

    it("unwraps BigNumber-like values", () => {
      const record = { amount: { numeric: 100 } }

      expect(matchesFilters(record, { amount: { $gt: 50 } })).toBe(true)
      expect(matchesFilters(record, { amount: { $eq: 100 } })).toBe(true)
      expect(matchesFilters(record, { amount: { $lt: 100 } })).toBe(false)
    })

    it("rejects incomparable values instead of guessing", () => {
      expect(matchesFilters({ meta: { a: 1 } }, { meta: { $gt: 1 } })).toBe(
        false
      )
      expect(matchesFilters({ title: "abc" }, { title: { $gt: 1 } })).toBe(
        false
      )
    })

    it("matches SQL three-valued logic for null values", () => {
      const record = { amount: null }

      // NULL never satisfies a comparison…
      expect(matchesFilters(record, { amount: { $gt: 5 } })).toBe(false)
      expect(matchesFilters(record, { amount: { $lte: 5 } })).toBe(false)
      expect(matchesFilters(record, { amount: { $ne: 5 } })).toBe(false)
      expect(matchesFilters(record, { amount: { $in: [null, 5] } })).toBe(false)
      expect(matchesFilters(record, { amount: { $nin: [5] } })).toBe(false)
      // …except the IS NULL / IS NOT NULL forms.
      expect(matchesFilters(record, { amount: { $eq: null } })).toBe(true)
      expect(matchesFilters(record, { amount: { $ne: null } })).toBe(false)
      expect(matchesFilters({ amount: 5 }, { amount: { $ne: null } })).toBe(
        true
      )
    })
  })

  describe("string operators", () => {
    const record = { title: "Winter Jacket" }

    it("evaluates $like with SQL wildcards", () => {
      expect(matchesFilters(record, { title: { $like: "Winter%" } })).toBe(true)
      expect(matchesFilters(record, { title: { $like: "winter%" } })).toBe(
        false
      )
      expect(matchesFilters(record, { title: { $like: "%Jack%" } })).toBe(true)
      expect(matchesFilters(record, { title: { $like: "Winter Jacke_" } })).toBe(
        true
      )
      expect(matchesFilters(record, { title: { $like: "Winter" } })).toBe(false)
    })

    it("escapes regex metacharacters in $like patterns", () => {
      const record = { code: "a.c" }

      expect(matchesFilters(record, { code: { $like: "a.c" } })).toBe(true)
      // "." must match literally, not as a regex wildcard.
      expect(matchesFilters({ code: "abc" }, { code: { $like: "a.c" } })).toBe(
        false
      )
    })

    it("evaluates $ilike case-insensitively", () => {
      expect(matchesFilters(record, { title: { $ilike: "winter%" } })).toBe(
        true
      )
      expect(matchesFilters(record, { title: { $ilike: "%JACKET" } })).toBe(
        true
      )
      expect(matchesFilters(record, { title: { $ilike: "summer%" } })).toBe(
        false
      )
    })

    it("evaluates $re as a regular expression", () => {
      expect(matchesFilters(record, { title: { $re: "^Winter" } })).toBe(true)
      expect(matchesFilters(record, { title: { $re: "Jacket$" } })).toBe(true)
      expect(matchesFilters(record, { title: { $re: "^jacket" } })).toBe(false)
    })

    it("evaluates $fulltext as per-token case-insensitive contains", () => {
      expect(matchesFilters(record, { title: { $fulltext: "jacket" } })).toBe(
        true
      )
      expect(
        matchesFilters(record, { title: { $fulltext: "jacket winter" } })
      ).toBe(true)
      expect(
        matchesFilters(record, { title: { $fulltext: "winter boots" } })
      ).toBe(false)
    })

    it("never matches string operators on null values", () => {
      const empty = { title: null }

      expect(matchesFilters(empty, { title: { $like: "%" } })).toBe(false)
      expect(matchesFilters(empty, { title: { $ilike: "%" } })).toBe(false)
      expect(matchesFilters(empty, { title: { $re: ".*" } })).toBe(false)
      expect(matchesFilters(empty, { title: { $fulltext: "x" } })).toBe(false)
    })
  })

  describe("array operators", () => {
    const record = { tags: ["sale", "new", "featured"] }

    it("evaluates $overlap, $contains, and $contained", () => {
      expect(matchesFilters(record, { tags: { $overlap: ["sale", "x"] } })).toBe(
        true
      )
      expect(matchesFilters(record, { tags: { $overlap: ["x", "y"] } })).toBe(
        false
      )

      expect(
        matchesFilters(record, { tags: { $contains: ["sale", "new"] } })
      ).toBe(true)
      expect(
        matchesFilters(record, { tags: { $contains: ["sale", "x"] } })
      ).toBe(false)

      expect(
        matchesFilters(record, {
          tags: { $contained: ["sale", "new", "featured", "extra"] },
        })
      ).toBe(true)
      expect(
        matchesFilters(record, { tags: { $contained: ["sale", "new"] } })
      ).toBe(false)
    })

    it("never matches array operators on non-array values", () => {
      const scalar = { tags: "sale" }

      expect(matchesFilters(scalar, { tags: { $overlap: ["sale"] } })).toBe(
        false
      )
      expect(matchesFilters(scalar, { tags: { $contains: ["sale"] } })).toBe(
        false
      )
      expect(matchesFilters(scalar, { tags: { $contained: ["sale"] } })).toBe(
        false
      )
    })
  })

  describe("$is and $exists", () => {
    it("evaluates $is against null and scalars", () => {
      expect(matchesFilters({ deleted_at: null }, { deleted_at: { $is: null } })).toBe(true)
      expect(matchesFilters({}, { deleted_at: { $is: null } })).toBe(true)
      expect(matchesFilters({ deleted_at: "x" }, { deleted_at: { $is: null } })).toBe(false)
      expect(matchesFilters({ active: true }, { active: { $is: true } })).toBe(
        true
      )
      expect(matchesFilters({ active: false }, { active: { $is: true } })).toBe(
        false
      )
    })

    it("evaluates $exists as a null check", () => {
      expect(matchesFilters({ sku: "abc" }, { sku: { $exists: true } })).toBe(
        true
      )
      expect(matchesFilters({ sku: null }, { sku: { $exists: true } })).toBe(
        false
      )
      expect(matchesFilters({}, { sku: { $exists: true } })).toBe(false)
      expect(matchesFilters({}, { sku: { $exists: false } })).toBe(true)
      expect(matchesFilters({ sku: "abc" }, { sku: { $exists: false } })).toBe(
        false
      )
    })
  })

  describe("logical composition", () => {
    const record = { title: "Shirt", amount: 100 }

    it("evaluates $and and $or at the record level", () => {
      expect(
        matchesFilters(record, {
          $and: [{ title: "Shirt" }, { amount: { $gt: 50 } }],
        })
      ).toBe(true)
      expect(
        matchesFilters(record, {
          $and: [{ title: "Shirt" }, { amount: { $gt: 500 } }],
        })
      ).toBe(false)
      expect(
        matchesFilters(record, {
          $or: [{ title: "Pants" }, { amount: { $gt: 50 } }],
        })
      ).toBe(true)
      expect(
        matchesFilters(record, {
          $or: [{ title: "Pants" }, { amount: { $gt: 500 } }],
        })
      ).toBe(false)
    })

    it("evaluates nested $and/$or groups", () => {
      expect(
        matchesFilters(record, {
          $or: [
            { $and: [{ title: "Shirt" }, { amount: { $lt: 50 } }] },
            { $and: [{ title: "Shirt" }, { amount: { $gte: 100 } }] },
          ],
        })
      ).toBe(true)
    })

    it("evaluates $not at the record level", () => {
      expect(matchesFilters(record, { $not: { title: "Pants" } })).toBe(true)
      expect(matchesFilters(record, { $not: { title: "Shirt" } })).toBe(false)
    })

    it("evaluates $and/$or/$not inside a field condition", () => {
      expect(
        matchesFilters(record, {
          amount: { $or: [{ $lt: 50 }, { $gt: 90 }] },
        })
      ).toBe(true)
      expect(
        matchesFilters(record, {
          amount: { $and: [{ $gt: 50 }, { $lt: 90 }] },
        })
      ).toBe(false)
      expect(
        matchesFilters(record, { title: { $not: { $like: "P%" } } })
      ).toBe(true)
      expect(
        matchesFilters(record, { title: { $not: { $like: "S%" } } })
      ).toBe(false)
    })
  })

  describe("relations and nested objects", () => {
    const record = {
      id: "ps1",
      product: { handle: "shirt", status: "published" },
      prices: [
        { amount: 10, currency_code: "usd" },
        { amount: 90, currency_code: "eur" },
      ],
      metadata: { color: "blue", size: { label: "L" } },
    }

    it("recurses into to-one relations", () => {
      expect(matchesFilters(record, { product: { handle: "shirt" } })).toBe(
        true
      )
      expect(matchesFilters(record, { product: { handle: "pants" } })).toBe(
        false
      )
    })

    it("applies EXISTS semantics on to-many relations", () => {
      expect(
        matchesFilters(record, { prices: { amount: { $gt: 50 } } })
      ).toBe(true)
      expect(
        matchesFilters(record, { prices: { amount: { $gt: 500 } } })
      ).toBe(false)
    })

    it("requires a single related record to satisfy all its conditions", () => {
      // No single price is both > 50 and usd, even though each condition
      // matches some price.
      expect(
        matchesFilters(record, {
          prices: { amount: { $gt: 50 }, currency_code: "usd" },
        })
      ).toBe(false)
      expect(
        matchesFilters(record, {
          prices: { amount: { $lt: 50 }, currency_code: "usd" },
        })
      ).toBe(true)
    })

    it("never matches through missing or empty relations", () => {
      expect(
        matchesFilters({ id: "1" }, { product: { handle: "shirt" } })
      ).toBe(false)
      expect(
        matchesFilters({ id: "1", product: null }, { product: { handle: "shirt" } })
      ).toBe(false)
      expect(
        matchesFilters({ id: "1", prices: [] }, { prices: { amount: 10 } })
      ).toBe(false)
    })

    it("recurses through multiple relation levels", () => {
      const cart = {
        items: [
          { product: { sales_channels: [{ name: "Retail" }] } },
          { product: { sales_channels: [{ name: "Wholesale" }] } },
        ],
      }

      expect(
        matchesFilters(cart, {
          items: { product: { sales_channels: { name: "Retail" } } },
        })
      ).toBe(true)
      expect(
        matchesFilters(cart, {
          items: { product: { sales_channels: { name: "Outlet" } } },
        })
      ).toBe(false)
    })

    it("recurses into JSON column values", () => {
      expect(matchesFilters(record, { metadata: { color: "blue" } })).toBe(true)
      expect(
        matchesFilters(record, { metadata: { size: { label: "L" } } })
      ).toBe(true)
      expect(
        matchesFilters(record, { metadata: { size: { label: "S" } } })
      ).toBe(false)
    })

    it("does not match object conditions against scalar arrays", () => {
      expect(
        matchesFilters({ tags: ["sale"] }, { tags: { value: "sale" } })
      ).toBe(false)
    })
  })

  describe("errors", () => {
    it("throws a clear error for operators it cannot evaluate", () => {
      expect(() =>
        matchesFilters({ title: "abc" }, { title: { $customOp: "x" } })
      ).toThrow('Operator "$customOp" is not supported')
    })
  })
})

describe("isOperatorMap", () => {
  it("detects plain objects whose keys are all operators", () => {
    expect(isOperatorMap({ $gt: 1 })).toBe(true)
    expect(isOperatorMap({ $gte: 1, $lt: 10 })).toBe(true)
    expect(isOperatorMap({})).toBe(false)
    expect(isOperatorMap({ $gt: 1, amount: 2 })).toBe(false)
    expect(isOperatorMap({ amount: 2 })).toBe(false)
    expect(isOperatorMap(null)).toBe(false)
    expect(isOperatorMap([{ $gt: 1 }])).toBe(false)
    expect(isOperatorMap(new Date())).toBe(false)
  })
})
