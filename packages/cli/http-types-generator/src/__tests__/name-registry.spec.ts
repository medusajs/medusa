import {
  NameRegistry,
  VALIDATOR_TO_HTTP_TYPE_NAME,
  DOMAIN_SCOPED_OVERRIDES,
} from "../mapping/name-registry"

describe("NameRegistry.resolveHttpTypeName", () => {
  describe("global registry lookups", () => {
    it("maps known validator names to their HTTP type names", () => {
      expect(NameRegistry.resolveHttpTypeName("AdminCustomersParams")).toBe(
        "AdminCustomerFilters"
      )
      expect(NameRegistry.resolveHttpTypeName("AdminGetOrdersParams")).toBe(
        "AdminOrderFilters"
      )
      expect(NameRegistry.resolveHttpTypeName("AdminGetProductOptionsParams")).toBe(
        "AdminProductOptionParams"
      )
      expect(NameRegistry.resolveHttpTypeName("StoreGetCollectionsParams")).toBe(
        "StoreCollectionListParams"
      )
    })

    it("returns 'skip' for validators mapped to skip in the global registry", () => {
      expect(NameRegistry.resolveHttpTypeName("AdminGetProductsParams")).toBe("skip")
      expect(NameRegistry.resolveHttpTypeName("StoreGetProductsParams")).toBe("skip")
      expect(NameRegistry.resolveHttpTypeName("AdminGetProductVariantParams")).toBe("skip")
    })

    it("falls back to the export name when no mapping exists", () => {
      expect(NameRegistry.resolveHttpTypeName("AdminCreateProduct")).toBe(
        "AdminCreateProduct"
      )
      expect(NameRegistry.resolveHttpTypeName("SomeUnknownName")).toBe(
        "SomeUnknownName"
      )
    })
  })

  describe("domain-scoped overrides", () => {
    it("returns the domain override when it exists, taking precedence over global", () => {
      expect(
        NameRegistry.resolveHttpTypeName("AdminGetOrdersOrderParams", "exchange")
      ).toBe("AdminOrderExchangeListParams")

      expect(
        NameRegistry.resolveHttpTypeName("AdminGetOrdersParams", "exchange")
      ).toBe("AdminExchangeListParams")
    })

    it("returns 'skip' for domain entries explicitly set to skip", () => {
      expect(
        NameRegistry.resolveHttpTypeName("AdminGetOrdersOrderParams", "return")
      ).toBe("skip")
    })

    it("falls back to global registry when no domain override exists for the name", () => {
      expect(
        NameRegistry.resolveHttpTypeName("AdminCustomersParams", "exchange")
      ).toBe("AdminCustomerFilters")
    })

    it("falls back to the export name when no domain or global mapping exists", () => {
      expect(
        NameRegistry.resolveHttpTypeName(
          "AdminCreateCustomProduct",
          "unknown-domain"
        )
      ).toBe("AdminCreateCustomProduct")
    })

    it("ignores domain when it is undefined", () => {
      expect(
        NameRegistry.resolveHttpTypeName("AdminGetOrdersOrderParams")
      ).toBe("AdminGetOrderParams")
    })
  })

  describe("claim domain overrides", () => {
    it("maps AdminGetOrdersOrderParams to AdminClaimParams in claim domain", () => {
      expect(
        NameRegistry.resolveHttpTypeName("AdminGetOrdersOrderParams", "claim")
      ).toBe("AdminClaimParams")
    })

    it("maps AdminGetOrdersParams to AdminClaimListParams in claim domain", () => {
      expect(
        NameRegistry.resolveHttpTypeName("AdminGetOrdersParams", "claim")
      ).toBe("AdminClaimListParams")
    })
  })
})

describe("NameRegistry.resolveValidatorName", () => {
  it("reverse-maps known HTTP type names back to validator names", () => {
    expect(NameRegistry.resolveValidatorName("AdminProductOptionParams")).toBe(
      "AdminGetProductOptionsParams"
    )
    expect(NameRegistry.resolveValidatorName("AdminCustomerFilters")).toBe(
      "AdminCustomersParams"
    )
    expect(NameRegistry.resolveValidatorName("AdminOrderFilters")).toBe(
      "AdminGetOrdersParams"
    )
  })

  it("falls back to HTTP type name for validators mapped to skip (excluded from reverse map)", () => {
    // AdminGetProductsParams maps to "skip", so "AdminProductListParams" has no reverse entry
    expect(NameRegistry.resolveValidatorName("AdminProductListParams")).toBe(
      "AdminProductListParams"
    )
  })

  it("falls back to the HTTP type name when no reverse mapping exists", () => {
    expect(NameRegistry.resolveValidatorName("AdminCreateProduct")).toBe(
      "AdminCreateProduct"
    )
    expect(NameRegistry.resolveValidatorName("SomeUnknownType")).toBe(
      "SomeUnknownType"
    )
  })
})

describe("registry consistency", () => {
  it("has unique keys (no duplicate validator names)", () => {
    const keys = Object.keys(VALIDATOR_TO_HTTP_TYPE_NAME)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it("domain-scoped override domains are valid path-mapper domain names", () => {
    const domains = Object.keys(DOMAIN_SCOPED_OVERRIDES)
    for (const domain of domains) {
      expect(domain).not.toMatch(/ges$|ces$|ons$/)
    }
  })
})
