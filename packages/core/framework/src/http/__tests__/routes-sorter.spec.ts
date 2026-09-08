import { RoutesSorter } from "../routes-sorter"

describe("Routes sorter", () => {
  it("should sort the given routes", () => {
    const sorter = new RoutesSorter([
      {
        matcher: "/v1",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/products",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/products",
        methods: ["GET"],
        isAppRoute: true,
        handler: () => {},
      },
      {
        matcher: "/admin",
        handler: () => {},
      },
      {
        matcher: "/store",
        handler: () => {},
      },
      {
        matcher: "/admin/products/export",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/products",
        isAppRoute: true,
        methods: ["POST"],
        handler: () => {},
      },
      {
        matcher: "/admin/products/:id",
        isAppRoute: true,
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/products/:id",
        isAppRoute: true,
        methods: ["POST"],
        handler: () => {},
      },
      {
        matcher: "/admin/products/batch",
        isAppRoute: true,
        methods: ["POST"],
        handler: () => {},
      },
      {
        matcher: "/admin/products/*",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/(products|collections)",
        methods: ["POST"],
        handler: () => {},
      },
      {
        matcher: "/admin/*",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/:id/export",
        isAppRoute: true,
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/*/export",
        methods: ["GET"],
        handler: () => {},
      },
    ])

    expect(sorter.sort()).toMatchInlineSnapshot(`
      [
        {
          "handler": [Function],
          "matcher": "/admin",
        },
        {
          "handler": [Function],
          "matcher": "/store",
        },
        {
          "handler": [Function],
          "matcher": "/v1",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/*",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/*/export",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/(products|collections)",
          "methods": [
            "POST",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/products",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "isAppRoute": true,
          "matcher": "/admin/products",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "isAppRoute": true,
          "matcher": "/admin/products",
          "methods": [
            "POST",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/products/*",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/products/export",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "isAppRoute": true,
          "matcher": "/admin/products/batch",
          "methods": [
            "POST",
          ],
        },
        {
          "handler": [Function],
          "isAppRoute": true,
          "matcher": "/admin/products/:id",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "isAppRoute": true,
          "matcher": "/admin/products/:id",
          "methods": [
            "POST",
          ],
        },
        {
          "handler": [Function],
          "isAppRoute": true,
          "matcher": "/admin/:id/export",
          "methods": [
            "GET",
          ],
        },
      ]
    `)
  })

  it("should handle all regex based routes", () => {
    const sorter = new RoutesSorter([
      {
        matcher: "/admin/:id/export",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/*/export",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/products",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/pr*ts",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/product(collection)?s",
        methods: ["GET"],
        handler: () => {},
      },
    ])

    expect(sorter.sort()).toMatchInlineSnapshot(`
      [
        {
          "handler": [Function],
          "matcher": "/admin/*/export",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/pr*ts",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/product(collection)?s",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/products",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/:id/export",
          "methods": [
            "GET",
          ],
        },
      ]
    `)
  })

  it("should keep RegExp matchers in the tree instead of dropping them", () => {
    const regexMatcher = /^\/admin\/foo(\/.*)?$/
    const sorter = new RoutesSorter([
      {
        matcher: "/admin/products",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: regexMatcher,
        methods: ["GET"],
        handler: () => {},
      },
    ])

    const sorted = sorter.sort()

    // The RegExp matcher must survive sorting (previously it was dropped)
    expect(sorted).toHaveLength(2)
    expect(sorted.some((route) => route.matcher === regexMatcher)).toBe(true)
  })

  it(`should keep a root ("/") matcher in the tree instead of dropping it`, () => {
    const sorter = new RoutesSorter([
      {
        matcher: "/",
        handler: () => {},
      },
      {
        matcher: "/admin/products",
        methods: ["GET"],
        handler: () => {},
      },
    ])

    const sorted = sorter.sort()

    // The zero-segment matcher must survive sorting (previously it was dropped)
    expect(sorted).toHaveLength(2)
    expect(sorted.some((route) => route.matcher === "/")).toBe(true)
  })

  it("should handle routes with multiple params", () => {
    const sorter = new RoutesSorter([
      {
        matcher: "/admin/customers/:id/addresses",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/customers/:id",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/customers/:id/addresses/:addressId/switch",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/customers/:id/addresses/:addressId",
        methods: ["GET"],
        handler: () => {},
      },
    ])

    expect(sorter.sort()).toMatchInlineSnapshot(`
      [
        {
          "handler": [Function],
          "matcher": "/admin/customers/:id",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/customers/:id/addresses",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/customers/:id/addresses/:addressId",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/customers/:id/addresses/:addressId/switch",
          "methods": [
            "GET",
          ],
        },
      ]
    `)
  })

  it("should sort routes with multiple params and static values", () => {
    const sorter = new RoutesSorter([
      {
        matcher: "/admin/promotions/:id/:rule_type",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher:
          "/admin/promotions/rule-value-options/:rule_type/:rule_attribute_id",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/promotions/rule-attribute-options/:rule_type",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/promotions/:id/:rule_type",
        methods: ["GET"],
        handler: () => {},
      },
      {
        matcher: "/admin/promotions/rule-attribute-options/:rule_type",
        methods: ["GET"],
        isAppRoute: true,
        handler: () => {},
      },
    ])

    expect(sorter.sort()).toMatchInlineSnapshot(`
      [
        {
          "handler": [Function],
          "matcher": "/admin/promotions/rule-value-options/:rule_type/:rule_attribute_id",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/promotions/rule-attribute-options/:rule_type",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "isAppRoute": true,
          "matcher": "/admin/promotions/rule-attribute-options/:rule_type",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/promotions/:id/:rule_type",
          "methods": [
            "GET",
          ],
        },
        {
          "handler": [Function],
          "matcher": "/admin/promotions/:id/:rule_type",
          "methods": [
            "GET",
          ],
        },
      ]
    `)
  })
})
