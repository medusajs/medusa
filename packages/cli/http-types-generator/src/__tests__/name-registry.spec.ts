import {
  resolveHttpTypeName,
  resolveValidatorName,
  VALIDATOR_TO_HTTP_TYPE_NAME,
  DOMAIN_SCOPED_OVERRIDES,
} from "../mapping/name-registry"

describe("resolveHttpTypeName", () => {
  describe("global registry lookups", () => {
    it("maps known validator names to their HTTP type names", () => {
      expect(resolveHttpTypeName("AdminGetProductsParams")).toBe(
        "AdminProductListParams"
      )
      expect(resolveHttpTypeName("AdminCustomersParams")).toBe(
        "AdminCustomerFilters"
      )
      expect(resolveHttpTypeName("AdminGetOrdersParams")).toBe(
        "AdminOrderFilters"
      )
      expect(resolveHttpTypeName("StoreGetProductsParams")).toBe(
        "StoreProductListParams"
      )
    })

    it("falls back to the export name when no mapping exists", () => {
      expect(resolveHttpTypeName("AdminCreateProduct")).toBe(
        "AdminCreateProduct"
      )
      expect(resolveHttpTypeName("SomeUnknownName")).toBe("SomeUnknownName")
    })
  })

  describe("domain-scoped overrides", () => {
    it("returns the domain override when it exists, taking precedence over global", () => {
      // exchange domain: AdminGetOrdersOrderParams → AdminOrderExchangeListParams
      // (global would map this to AdminGetOrderParams)
      expect(
        resolveHttpTypeName("AdminGetOrdersOrderParams", "exchange")
      ).toBe("AdminOrderExchangeListParams")

      expect(resolveHttpTypeName("AdminGetOrdersParams", "exchange")).toBe(
        "AdminExchangeListParams"
      )
    })

    it("returns 'skip' for domain entries explicitly set to skip", () => {
      // return domain: AdminGetOrdersOrderParams is skipped
      expect(resolveHttpTypeName("AdminGetOrdersOrderParams", "return")).toBe(
        "skip"
      )
    })

    it("falls back to global registry when no domain override exists for the name", () => {
      // AdminGetOrdersParams in claim domain has an override; AdminCustomersParams does not
      expect(resolveHttpTypeName("AdminCustomersParams", "exchange")).toBe(
        "AdminCustomerFilters"
      )
    })

    it("falls back to the export name when no domain or global mapping exists", () => {
      expect(
        resolveHttpTypeName("AdminCreateCustomProduct", "unknown-domain")
      ).toBe("AdminCreateCustomProduct")
    })

    it("ignores domain when it is undefined", () => {
      expect(resolveHttpTypeName("AdminGetOrdersOrderParams")).toBe(
        "AdminGetOrderParams"
      )
    })
  })

  describe("claim domain overrides", () => {
    it("maps AdminGetOrdersOrderParams to AdminClaimActionsParams in claim domain", () => {
      expect(
        resolveHttpTypeName("AdminGetOrdersOrderParams", "claim")
      ).toBe("AdminClaimActionsParams")
    })

    it("maps AdminGetOrdersParams to AdminClaimListParams in claim domain", () => {
      expect(resolveHttpTypeName("AdminGetOrdersParams", "claim")).toBe(
        "AdminClaimListParams"
      )
    })
  })
})

describe("resolveValidatorName", () => {
  it("reverse-maps known HTTP type names back to validator names", () => {
    expect(resolveValidatorName("AdminProductListParams")).toBe(
      "AdminGetProductsParams"
    )
    expect(resolveValidatorName("AdminCustomerFilters")).toBe(
      "AdminCustomersParams"
    )
    expect(resolveValidatorName("AdminOrderFilters")).toBe(
      "AdminGetOrdersParams"
    )
  })

  it("falls back to the HTTP type name when no reverse mapping exists", () => {
    expect(resolveValidatorName("AdminCreateProduct")).toBe("AdminCreateProduct")
    expect(resolveValidatorName("SomeUnknownType")).toBe("SomeUnknownType")
  })
})

describe("registry consistency", () => {
  it("has unique keys (no duplicate validator names)", () => {
    // Multiple validators may legitimately map to the same HTTP type
    // (e.g. both singular AdminGetProductVariantParams and plural
    // AdminGetProductVariantsParams → AdminProductVariantParams), so
    // value uniqueness is NOT enforced. Only keys must be unique,
    // which is guaranteed by the object literal — this test documents intent.
    const keys = Object.keys(VALIDATOR_TO_HTTP_TYPE_NAME)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it("domain-scoped override domains are valid path-mapper domain names", () => {
    // Domain keys should be singular/normalized names (as returned by path-mapper)
    const domains = Object.keys(DOMAIN_SCOPED_OVERRIDES)
    for (const domain of domains) {
      // Should not have trailing 's' that indicates a non-normalized route dir
      expect(domain).not.toMatch(/ges$|ces$|ons$/)
    }
  })
})
