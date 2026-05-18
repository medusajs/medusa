import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { waitForIndexedEntities } from "../../../../helpers/wait-for-index"

// Enable the Index module + the `index_engine` feature flag in
// `integration-tests/http/medusa-config.js`. The flag flips the
// admin `/admin/products` GET route onto the Index engine code path,
// which is the path the `searchReach` optimisation operates on.
process.env.ENABLE_INDEX_MODULE = "true"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let productMatchingTitleOnly: any
    let productMatchingSkuOnly: any
    let productMatchingBoth: any
    let productMatchingNeither: any

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())

      // Distinct tokens per product so each search asserts a single, well
      // understood outcome. Tokens are deliberately uncommon (no English
      // stop words) so the `simple` PG dictionary keeps them intact.
      const titleOnly = await api.post(
        "/admin/products",
        {
          title: "Reachalpha Standalone Title",
          status: "published",
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default variant",
              sku: "PLAIN-VARIANT-001",
              options: { Default: "Default" },
              prices: [{ currency_code: "usd", amount: 1000 }],
            },
          ],
        },
        adminHeaders
      )
      productMatchingTitleOnly = titleOnly.data.product

      const skuOnly = await api.post(
        "/admin/products",
        {
          title: "Unmemorable Product",
          status: "published",
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "SKU-bearing variant",
              sku: "REACHBETA-VARIANT-SKU-42",
              options: { Default: "Default" },
              prices: [{ currency_code: "usd", amount: 1500 }],
            },
          ],
        },
        adminHeaders
      )
      productMatchingSkuOnly = skuOnly.data.product

      const both = await api.post(
        "/admin/products",
        {
          title: "Reachgamma combined title",
          status: "published",
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Combined match variant",
              sku: "REACHGAMMA-VARIANT-SKU",
              options: { Default: "Default" },
              prices: [{ currency_code: "usd", amount: 2000 }],
            },
          ],
        },
        adminHeaders
      )
      productMatchingBoth = both.data.product

      const neither = await api.post(
        "/admin/products",
        {
          title: "Decoy product",
          status: "published",
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Decoy variant",
              sku: "DECOY-VARIANT-SKU",
              options: { Default: "Default" },
              prices: [{ currency_code: "usd", amount: 2500 }],
            },
          ],
        },
        adminHeaders
      )
      productMatchingNeither = neither.data.product

      // Wait deterministically for both partitions to catch up. Index sync
      // is async (event-driven) so we have to gate the assertions on the
      // rows actually landing in cat_product and cat_productvariant before
      // running searches.
      const productIds = [
        productMatchingTitleOnly.id,
        productMatchingSkuOnly.id,
        productMatchingBoth.id,
        productMatchingNeither.id,
      ]
      const variantIds = [
        productMatchingTitleOnly.variants[0].id,
        productMatchingSkuOnly.variants[0].id,
        productMatchingBoth.variants[0].id,
        productMatchingNeither.variants[0].id,
      ]

      await waitForIndexedEntities(dbConnection, "Product", productIds)
      await waitForIndexedEntities(
        dbConnection,
        "ProductVariant",
        variantIds
      )
    })

    afterAll(() => {
      delete process.env.ENABLE_INDEX_MODULE
    })

    describe("GET /admin/products - Index engine search reach", () => {
      it("matches by product title via the root document_tsv", async () => {
        const response = await api.get(
          "/admin/products?q=Reachalpha",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        const ids = response.data.products.map((p: any) => p.id)
        expect(ids).toContain(productMatchingTitleOnly.id)
        expect(ids).not.toContain(productMatchingSkuOnly.id)
        expect(ids).not.toContain(productMatchingNeither.id)
      })

      it("matches by variant SKU via the search-reach EXISTS subquery", async () => {
        // The product title has no occurrence of the SKU token, so the only
        // way this match can come back is via the EXISTS branch traversing
        // into cat_productvariant. This is the path the customer-reported
        // 11s queries used to walk and is the case we optimised.
        const response = await api.get(
          "/admin/products?q=REACHBETA",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        const ids = response.data.products.map((p: any) => p.id)
        expect(ids).toContain(productMatchingSkuOnly.id)
        expect(ids).not.toContain(productMatchingTitleOnly.id)
        expect(ids).not.toContain(productMatchingNeither.id)
      })

      it("returns a product once when the term hits both title and variant SKU", async () => {
        // Both the product title and the variant SKU contain the term. The
        // OR-on-root + EXISTS-on-variants logic must not double-count the
        // product into the result set.
        const response = await api.get(
          "/admin/products?q=REACHGAMMA",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        const matchingIds = response.data.products
          .map((p: any) => p.id)
          .filter((id: string) => id === productMatchingBoth.id)
        expect(matchingIds).toEqual([productMatchingBoth.id])
      })

      it("returns an empty set when nothing in the catalog matches", async () => {
        // Mirrors the customer-reported worst case: a junk token that
        // matches neither product nor variant tsvector. Under the old
        // OR-on-join plan this took 11s; here we just confirm semantic
        // correctness (the empty result) — the speedup is verified
        // separately via DB benchmarking.
        const response = await api.get(
          "/admin/products?q=zzznosuchtermzzz",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.products).toEqual([])
      })

      it("composes a structural filter with search reach onto variants", async () => {
        // status=published narrows via a filter on the root product
        // partition; the search reach onto variants still has to find the
        // SKU-only product. Verifies the two clauses compose correctly.
        const response = await api.get(
          "/admin/products?q=REACHBETA&status[]=published",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        const ids = response.data.products.map((p: any) => p.id)
        expect(ids).toContain(productMatchingSkuOnly.id)
      })

      it("excludes results when status filter eliminates all matches", async () => {
        // status=draft should match nothing because we created everything
        // as 'published'. This confirms filters still constrain results
        // even when the search reach EXISTS branch would otherwise match.
        const response = await api.get(
          "/admin/products?q=REACHBETA&status[]=draft",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        const ids = response.data.products.map((p: any) => p.id)
        expect(ids).not.toContain(productMatchingSkuOnly.id)
      })

      it("hydrates variant data on the matched product", async () => {
        // The index engine returns matching ids; query.graph then hydrates
        // relations. The perf fix only touches the id-finding query, but
        // the response shape is what callers depend on — so guard it.
        const response = await api.get(
          "/admin/products?q=REACHBETA",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        const matched = response.data.products.find(
          (p: any) => p.id === productMatchingSkuOnly.id
        )
        expect(matched).toBeDefined()
        expect(matched.variants).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ sku: "REACHBETA-VARIANT-SKU-42" }),
          ])
        )
      })
    })
  },
})
