import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("GET /admin/products - SKU Search", () => {
      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, getContainer())
      })

      describe("searching products by variant SKU using q parameter", () => {
        it("should return products when searching by exact variant SKU", async () => {
          // Create a product with a unique SKU
          let product
          product = await api.post(
            "/admin/products",
            {
              title: "Test Product for SKU Search",
              status: "published",
              options: [
                {
                  title: "Default",
                  values: ["Default"],
                },
              ],
              variants: [
                {
                  title: "Test Variant",
                  sku: "UNIQUE-SKU-12345",
                  options: {
                    Default: "Default",
                  },
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 1000,
                    },
                  ],
                },
              ],
            },
            adminHeaders
          )

          expect(product.status).toEqual(200)
          expect(product.data.product).toBeDefined()

          // Search for the product using the SKU
          const response = await api.get(
            "/admin/products?q=UNIQUE-SKU-12345",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.products).toHaveLength(1)
          expect(response.data.products[0].id).toEqual(product.data.product.id)
          expect(response.data.products[0].variants).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                sku: "UNIQUE-SKU-12345",
              }),
            ])
          )
        })

        it("should return products when searching by partial variant SKU", async () => {
          // Create a product with a SKU
          const product = await api.post(
            "/admin/products",
            {
              title: "Another Test Product",
              status: "published",
              options: [
                {
                  title: "Default",
                  values: ["Default"],
                },
              ],
              variants: [
                {
                  title: "Another Variant",
                  sku: "PARTIAL-TEST-SKU-999",
                  options: {
                    Default: "Default",
                  },
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 2000,
                    },
                  ],
                },
              ],
            },
            adminHeaders
          )

          expect(product.status).toEqual(200)

          // Search using partial SKU
          const response = await api.get(
            "/admin/products?q=TEST-SKU",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.products.length).toBeGreaterThanOrEqual(1)

          const foundProduct = response.data.products.find(
            (p) => p.id === product.data.product.id
          )
          expect(foundProduct).toBeDefined()
          expect(foundProduct.variants).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                sku: "PARTIAL-TEST-SKU-999",
              }),
            ])
          )
        })

        it("should return products with multiple variants when searching by SKU of one variant", async () => {
          // Create a product with multiple variants
          const product = await api.post(
            "/admin/products",
            {
              title: "Multi-Variant Product",
              status: "published",
              options: [
                {
                  title: "Size",
                  values: ["Small", "Large"],
                },
              ],
              variants: [
                {
                  title: "Small Variant",
                  sku: "MULTI-VAR-SMALL",
                  options: {
                    Size: "Small",
                  },
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 1500,
                    },
                  ],
                },
                {
                  title: "Large Variant",
                  sku: "MULTI-VAR-LARGE",
                  options: {
                    Size: "Large",
                  },
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 2500,
                    },
                  ],
                },
              ],
            },
            adminHeaders
          )

          expect(product.status).toEqual(200)

          // Search using one variant's SKU
          const response = await api.get(
            "/admin/products?q=MULTI-VAR-SMALL",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.products.length).toBeGreaterThanOrEqual(1)

          const foundProduct = response.data.products.find(
            (p) => p.id === product.data.product.id
          )
          expect(foundProduct).toBeDefined()
          // Should return the product with all its variants
          expect(foundProduct.variants.length).toEqual(2)
        })

        it("should search across product title AND variant SKU", async () => {
          // Create products to test combined search
          const productWithTitleMatch = await api.post(
            "/admin/products",
            {
              title: "SearchTerm Product",
              status: "published",
              options: [
                {
                  title: "Default",
                  values: ["Default"],
                },
              ],
              variants: [
                {
                  title: "Regular Variant",
                  sku: "REGULAR-SKU-001",
                  options: {
                    Default: "Default",
                  },
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 1000,
                    },
                  ],
                },
              ],
            },
            adminHeaders
          )

          const productWithSKUMatch = await api.post(
            "/admin/products",
            {
              title: "Different Product",
              status: "published",
              options: [
                {
                  title: "Default",
                  values: ["Default"],
                },
              ],
              variants: [
                {
                  title: "Variant with SearchTerm in SKU",
                  sku: "SearchTerm-SKU-002",
                  options: {
                    Default: "Default",
                  },
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 1500,
                    },
                  ],
                },
              ],
            },
            adminHeaders
          )

          expect(productWithTitleMatch.status).toEqual(200)
          expect(productWithSKUMatch.status).toEqual(200)

          // Search using the term - should find both products
          const response = await api.get(
            "/admin/products?q=SearchTerm",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.products.length).toBeGreaterThanOrEqual(2)

          const productIds = response.data.products.map((p) => p.id)
          expect(productIds).toContain(productWithTitleMatch.data.product.id)
          expect(productIds).toContain(productWithSKUMatch.data.product.id)
        })

        it("should not return products when searching for non-existent SKU", async () => {
          // Create a product
          await api.post(
            "/admin/products",
            {
              title: "Product without matching SKU",
              status: "published",
              options: [
                {
                  title: "Default",
                  values: ["Default"],
                },
              ],
              variants: [
                {
                  title: "Normal Variant",
                  sku: "NORMAL-SKU-123",
                  options: {
                    Default: "Default",
                  },
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 1000,
                    },
                  ],
                },
              ],
            },
            adminHeaders
          )

          // Search for a non-existent SKU
          const response = await api.get(
            "/admin/products?q=NONEXISTENT-SKU-99999",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.products).toHaveLength(0)
        })

        it("should be case-insensitive when searching by SKU", async () => {
          // Create a product with uppercase SKU
          const product = await api.post(
            "/admin/products",
            {
              title: "Case Test Product",
              status: "published",
              options: [
                {
                  title: "Default",
                  values: ["Default"],
                },
              ],
              variants: [
                {
                  title: "Case Test Variant",
                  sku: "UPPERCASE-SKU-ABC",
                  options: {
                    Default: "Default",
                  },
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 1000,
                    },
                  ],
                },
              ],
            },
            adminHeaders
          )

          expect(product.status).toEqual(200)

          // Search using lowercase
          const response = await api.get(
            "/admin/products?q=uppercase-sku-abc",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.products.length).toBeGreaterThanOrEqual(1)

          const foundProduct = response.data.products.find(
            (p) => p.id === product.data.product.id
          )
          expect(foundProduct).toBeDefined()
        })
      })
    })
  },
})
