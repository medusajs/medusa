import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { MedusaContainer } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(100000)

process.env.MEDUSA_FF_TRANSLATION = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin Translation API", () => {
      let appContainer: MedusaContainer

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, getContainer())

        const translationModule = appContainer.resolve(Modules.TRANSLATION)
        await translationModule.__hooks?.onApplicationStart?.().catch(() => {})

        const storeModule = appContainer.resolve(Modules.STORE)
        const [defaultStore] = await storeModule.listStores(
          {},
          {
            select: ["id"],
            take: 1,
          }
        )
        await storeModule.updateStores(defaultStore.id, {
          supported_locales: [
            { locale_code: "en-US" },
            { locale_code: "fr-FR" },
            { locale_code: "de-DE" },
          ],
        })
      })

      afterAll(async () => {
        delete process.env.MEDUSA_FF_TRANSLATION
      })

      describe("GET /admin/translations", () => {
        it("should list translations (empty initially)", async () => {
          const response = await api.get("/admin/translations", adminHeaders)

          expect(response.status).toEqual(200)
          expect(response.data).toEqual(
            expect.objectContaining({
              translations: [],
              count: 0,
              offset: 0,
              limit: 20,
            })
          )
        })

        it("should list translations after creating some", async () => {
          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "prod_123",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: {
                    title: "Titre du produit",
                    description: "Description en français",
                  },
                },
                {
                  reference_id: "prod_123",
                  reference: "product",
                  locale_code: "de-DE",
                  translations: {
                    title: "Produkttitel",
                    description: "Beschreibung auf Deutsch",
                  },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get("/admin/translations", adminHeaders)

          expect(response.status).toEqual(200)
          expect(response.data.translations).toHaveLength(2)
          expect(response.data.count).toEqual(2)
          expect(response.data.translations).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                reference_id: "prod_123",
                reference: "product",
                locale_code: "fr-FR",
                translations: {
                  title: "Titre du produit",
                  description: "Description en français",
                },
              }),
              expect.objectContaining({
                reference_id: "prod_123",
                reference: "product",
                locale_code: "de-DE",
                translations: {
                  title: "Produkttitel",
                  description: "Beschreibung auf Deutsch",
                },
              }),
            ])
          )
        })

        it("should filter translations by reference_id", async () => {
          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "prod_1",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Produit Un" },
                },
                {
                  reference_id: "prod_2",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Produit Deux" },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get(
            "/admin/translations?reference_id=prod_1",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.translations).toHaveLength(1)
          expect(response.data.translations[0].reference_id).toEqual("prod_1")
        })

        it("should filter translations by reference", async () => {
          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "prod_1",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Produit" },
                },
                {
                  reference_id: "cat_1",
                  reference: "product_category",
                  locale_code: "fr-FR",
                  translations: { name: "Catégorie" },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get(
            "/admin/translations?reference=product_category",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.translations).toHaveLength(1)
          expect(response.data.translations[0].reference).toEqual(
            "product_category"
          )
        })

        it("should filter translations by locale_code", async () => {
          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "prod_1",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Titre français" },
                },
                {
                  reference_id: "prod_1",
                  reference: "product",
                  locale_code: "de-DE",
                  translations: { title: "Deutscher Titel" },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get(
            "/admin/translations?locale_code=de-DE",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.translations).toHaveLength(1)
          expect(response.data.translations[0].locale_code).toEqual("de-DE")
        })

        it("should filter translations by multiple criteria", async () => {
          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "prod_1",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Produit Un FR" },
                },
                {
                  reference_id: "prod_1",
                  reference: "product",
                  locale_code: "de-DE",
                  translations: { title: "Produkt Eins DE" },
                },
                {
                  reference_id: "prod_2",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Produit Deux FR" },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get(
            "/admin/translations?reference_id=prod_1&locale_code=fr-FR",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.translations).toHaveLength(1)
          expect(response.data.translations[0]).toEqual(
            expect.objectContaining({
              reference_id: "prod_1",
              locale_code: "fr-FR",
              translations: { title: "Produit Un FR" },
            })
          )
        })

        it("should support pagination", async () => {
          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "prod_1",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Produit 1" },
                },
                {
                  reference_id: "prod_2",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Produit 2" },
                },
                {
                  reference_id: "prod_3",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: { title: "Produit 3" },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get(
            "/admin/translations?limit=2&offset=0",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.translations).toHaveLength(2)
          expect(response.data.count).toEqual(3)
          expect(response.data.limit).toEqual(2)
          expect(response.data.offset).toEqual(0)

          const response2 = await api.get(
            "/admin/translations?limit=2&offset=2",
            adminHeaders
          )

          expect(response2.status).toEqual(200)
          expect(response2.data.translations).toHaveLength(1)
          expect(response2.data.offset).toEqual(2)
        })

        it("should filter translations using q parameter (JSONB search)", async () => {
          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "prod_1",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: {
                    title: "Chaussures de sport",
                    description: "Des chaussures confortables",
                  },
                },
                {
                  reference_id: "prod_2",
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: {
                    title: "T-shirt de sport",
                    description: "Un t-shirt léger",
                  },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get(
            "/admin/translations?q=chaussures",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.translations).toHaveLength(1)
          expect(response.data.translations[0].reference_id).toEqual("prod_1")
        })
      })

      describe("POST /admin/translations/batch", () => {
        describe("create", () => {
          it("should create a single translation", async () => {
            const response = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_123",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: {
                      title: "Titre du produit",
                    },
                  },
                ],
              },
              adminHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.created).toHaveLength(1)
            expect(response.data.created[0]).toEqual(
              expect.objectContaining({
                id: expect.stringMatching(/^trans_/),
                reference_id: "prod_123",
                reference: "product",
                locale_code: "fr-FR",
                translations: {
                  title: "Titre du produit",
                },
              })
            )
          })

          it("should create multiple translations", async () => {
            const response = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_123",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Titre FR" },
                  },
                  {
                    reference_id: "prod_123",
                    reference: "product",
                    locale_code: "de-DE",
                    translations: { title: "Titel DE" },
                  },
                  {
                    reference_id: "var_456",
                    reference: "product_variant",
                    locale_code: "fr-FR",
                    translations: { title: "Variante FR" },
                  },
                ],
              },
              adminHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.created).toHaveLength(3)
          })

          it("should create translations for different entity types", async () => {
            const response = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_123",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Produit" },
                  },
                  {
                    reference_id: "cat_456",
                    reference: "product_category",
                    locale_code: "fr-FR",
                    translations: { name: "Catégorie" },
                  },
                  {
                    reference_id: "col_789",
                    reference: "product_collection",
                    locale_code: "fr-FR",
                    translations: { title: "Collection" },
                  },
                ],
              },
              adminHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.created).toHaveLength(3)
            expect(response.data.created).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ reference: "product" }),
                expect.objectContaining({ reference: "product_category" }),
                expect.objectContaining({ reference: "product_collection" }),
              ])
            )
          })
        })

        describe("update", () => {
          it("should update an existing translation", async () => {
            const createResponse = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_123",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Ancien titre" },
                  },
                ],
              },
              adminHeaders
            )

            const translationId = createResponse.data.created[0].id

            const updateResponse = await api.post(
              "/admin/translations/batch",
              {
                update: [
                  {
                    id: translationId,
                    translations: { title: "Nouveau titre" },
                  },
                ],
              },
              adminHeaders
            )

            expect(updateResponse.status).toEqual(200)
            expect(updateResponse.data.updated).toHaveLength(1)
            expect(updateResponse.data.updated[0]).toEqual(
              expect.objectContaining({
                id: translationId,
                translations: { title: "Nouveau titre" },
              })
            )
          })

          it("should update multiple translations", async () => {
            const createResponse = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_1",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Titre 1" },
                  },
                  {
                    reference_id: "prod_2",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Titre 2" },
                  },
                ],
              },
              adminHeaders
            )

            const [trans1, trans2] = createResponse.data.created

            const updateResponse = await api.post(
              "/admin/translations/batch",
              {
                update: [
                  { id: trans1.id, translations: { title: "Nouveau 1" } },
                  { id: trans2.id, translations: { title: "Nouveau 2" } },
                ],
              },
              adminHeaders
            )

            expect(updateResponse.status).toEqual(200)
            expect(updateResponse.data.updated).toHaveLength(2)
          })
        })

        describe("delete", () => {
          it("should delete a translation", async () => {
            const createResponse = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_123",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "À supprimer" },
                  },
                ],
              },
              adminHeaders
            )

            const translationId = createResponse.data.created[0].id

            const deleteResponse = await api.post(
              "/admin/translations/batch",
              {
                delete: [translationId],
              },
              adminHeaders
            )

            expect(deleteResponse.status).toEqual(200)
            expect(deleteResponse.data.deleted).toEqual({
              ids: [translationId],
              object: "translation",
              deleted: true,
            })

            const listResponse = await api.get(
              `/admin/translations?reference_id=prod_123`,
              adminHeaders
            )
            expect(listResponse.data.translations).toHaveLength(0)
          })

          it("should delete multiple translations", async () => {
            const createResponse = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_1",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Supprimer 1" },
                  },
                  {
                    reference_id: "prod_2",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Supprimer 2" },
                  },
                ],
              },
              adminHeaders
            )

            const ids = createResponse.data.created.map((t) => t.id)

            const deleteResponse = await api.post(
              "/admin/translations/batch",
              {
                delete: ids,
              },
              adminHeaders
            )

            expect(deleteResponse.status).toEqual(200)
            expect(deleteResponse.data.deleted.ids).toHaveLength(2)
          })
        })

        describe("combined operations", () => {
          it("should handle create, update, and delete in a single batch", async () => {
            const createResponse = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_existing",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Existant" },
                  },
                  {
                    reference_id: "prod_to_delete",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "À supprimer" },
                  },
                ],
              },
              adminHeaders
            )

            const existingId = createResponse.data.created[0].id
            const toDeleteId = createResponse.data.created[1].id

            const batchResponse = await api.post(
              "/admin/translations/batch",
              {
                create: [
                  {
                    reference_id: "prod_new",
                    reference: "product",
                    locale_code: "fr-FR",
                    translations: { title: "Nouveau" },
                  },
                ],
                update: [
                  {
                    id: existingId,
                    translations: { title: "Mis à jour" },
                  },
                ],
                delete: [toDeleteId],
              },
              adminHeaders
            )

            expect(batchResponse.status).toEqual(200)
            expect(batchResponse.data.created).toHaveLength(1)
            expect(batchResponse.data.updated).toHaveLength(1)
            expect(batchResponse.data.deleted.ids).toContain(toDeleteId)

            expect(batchResponse.data.created[0].translations.title).toEqual(
              "Nouveau"
            )
            expect(batchResponse.data.updated[0].translations.title).toEqual(
              "Mis à jour"
            )
          })
        })
      })

      describe("GET /admin/translations/statistics", () => {
        it("should return statistics for entity types with no translations", async () => {
          const productModule = appContainer.resolve(Modules.PRODUCT)
          await productModule.createProducts([
            { title: "Product 1" },
            { title: "Product 2" },
          ])

          const response = await api.get(
            "/admin/translations/statistics?locales=en-US&locales=fr-FR&entity_types=product",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.statistics).toBeDefined()
          expect(response.data.statistics.product).toEqual({
            // 2 products × 4 translatable fields × 2 locales = 16 expected
            expected: 16,
            translated: 0,
            missing: 16,
            by_locale: {
              "en-US": { expected: 8, translated: 0, missing: 8 },
              "fr-FR": { expected: 8, translated: 0, missing: 8 },
            },
          })
        })

        it("should return statistics with partial translations", async () => {
          const productModule = appContainer.resolve(Modules.PRODUCT)
          const [product1, product2] = await productModule.createProducts([
            { title: "Product 1" },
            { title: "Product 2" },
          ])

          // Create translations for product1 with partial fields
          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: product1.id,
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: {
                    title: "Produit 1",
                    description: "Description du produit 1",
                  },
                },
                {
                  reference_id: product2.id,
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: {
                    title: "Produit 2",
                  },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get(
            "/admin/translations/statistics?locales=fr-FR&entity_types=product",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          // 2 products × 4 fields × 1 locale = 8 expected
          // product1 has 2 fields, product2 has 1 field = 3 translated
          expect(response.data.statistics.product).toEqual({
            expected: 8,
            translated: 3,
            missing: 5,
            by_locale: {
              "fr-FR": { expected: 8, translated: 3, missing: 5 },
            },
          })
        })

        it("should return statistics for multiple entity types", async () => {
          const productModule = appContainer.resolve(Modules.PRODUCT)
          const [product] = await productModule.createProducts([
            {
              title: "Product with variant",
              variants: [{ title: "Variant 1" }, { title: "Variant 2" }],
            },
          ])

          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: product.id,
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: {
                    title: "Produit",
                    description: "Description",
                    subtitle: "Sous-titre",
                    material: "Matériau",
                  },
                },
                {
                  reference_id: product.variants[0].id,
                  reference: "product_variant",
                  locale_code: "fr-FR",
                  translations: {
                    title: "Variante 1",
                  },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get(
            "/admin/translations/statistics?locales=fr-FR&entity_types=product&entity_types=product_variant",
            adminHeaders
          )

          expect(response.status).toEqual(200)

          // Product: 1 × 4 fields × 1 locale = 4, all translated
          expect(response.data.statistics.product).toEqual({
            expected: 4,
            translated: 4,
            missing: 0,
            by_locale: {
              "fr-FR": { expected: 4, translated: 4, missing: 0 },
            },
          })

          // Variant: 2 × 2 fields × 1 locale = 4, 1 translated
          expect(response.data.statistics.product_variant).toEqual({
            expected: 4,
            translated: 1,
            missing: 3,
            by_locale: {
              "fr-FR": { expected: 4, translated: 1, missing: 3 },
            },
          })
        })

        it("should return statistics for multiple locales", async () => {
          const productModule = appContainer.resolve(Modules.PRODUCT)
          const [product] = await productModule.createProducts([
            { title: "Product" },
          ])

          await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: product.id,
                  reference: "product",
                  locale_code: "fr-FR",
                  translations: {
                    title: "Produit",
                    description: "Description",
                  },
                },
                {
                  reference_id: product.id,
                  reference: "product",
                  locale_code: "de-DE",
                  translations: { title: "Produkt" },
                },
              ],
            },
            adminHeaders
          )

          const response = await api.get(
            "/admin/translations/statistics?locales=fr-FR&locales=de-DE&entity_types=product",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          // 1 product × 4 fields × 2 locales = 8 expected
          // fr-FR: 2 translated, de-DE: 1 translated = 3 total
          expect(response.data.statistics.product.expected).toEqual(8)
          expect(response.data.statistics.product.translated).toEqual(3)
          expect(response.data.statistics.product.missing).toEqual(5)

          expect(response.data.statistics.product.by_locale["fr-FR"]).toEqual({
            expected: 4,
            translated: 2,
            missing: 2,
          })
          expect(response.data.statistics.product.by_locale["de-DE"]).toEqual({
            expected: 4,
            translated: 1,
            missing: 3,
          })
        })

        it("should return zeros for unknown entity types", async () => {
          const response = await api.get(
            "/admin/translations/statistics?locales=fr-FR&entity_types=unknown_entity",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.statistics.unknown_entity).toEqual({
            expected: 0,
            translated: 0,
            missing: 0,
            by_locale: {
              "fr-FR": { expected: 0, translated: 0, missing: 0 },
            },
          })
        })

        it("should validate required fields", async () => {
          const response1 = await api
            .get(
              "/admin/translations/statistics?entity_types=product",
              adminHeaders
            )
            .catch((e) => e.response)

          expect(response1.status).toEqual(400)

          const response2 = await api
            .get("/admin/translations/statistics?locales=fr-FR", adminHeaders)
            .catch((e) => e.response)

          expect(response2.status).toEqual(400)

          const response3 = await api
            .get("/admin/translations/statistics", adminHeaders)
            .catch((e) => e.response)

          expect(response3.status).toEqual(400)
        })
      })

      describe("GET /admin/translations/entities", () => {
        it("should return entities with only translatable fields", async () => {
          const productModule = appContainer.resolve(Modules.PRODUCT)
          await productModule.createProducts([
            {
              title: "Product 1",
              description: "Description 1",
              handle: "product-1",
              status: "published",
            },
            {
              title: "Product 2",
              description: "Description 2",
              handle: "product-2",
              status: "draft",
            },
          ])

          const response = await api.get(
            "/admin/translations/entities?type=product",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.data).toHaveLength(2)
          expect(response.data.count).toEqual(2)
          expect(response.data.offset).toEqual(0)
          expect(response.data.limit).toEqual(20)

          response.data.data.forEach((entity: Record<string, unknown>) => {
            expect(entity).toHaveProperty("id")
            expect(entity.title).toBeDefined()
            expect(entity.description).toBeDefined()
            expect(entity.material).toBeDefined()
            expect(entity.status).not.toBeDefined()
          })
        })

        it("should return empty array for unknown entity type", async () => {
          const response = await api.get(
            "/admin/translations/entities?type=unknown_entity",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.data).toEqual([])
          expect(response.data.count).toEqual(0)
        })

        it("should support pagination", async () => {
          const productModule = appContainer.resolve(Modules.PRODUCT)
          await productModule.createProducts([
            { title: "Product 1" },
            { title: "Product 2" },
            { title: "Product 3" },
            { title: "Product 4" },
            { title: "Product 5" },
          ])

          const response = await api.get(
            "/admin/translations/entities?type=product&limit=2&offset=0",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.data).toHaveLength(2)
          expect(response.data.count).toEqual(5)
          expect(response.data.limit).toEqual(2)
          expect(response.data.offset).toEqual(0)

          const response2 = await api.get(
            "/admin/translations/entities?type=product&limit=2&offset=2",
            adminHeaders
          )

          expect(response2.status).toEqual(200)
          expect(response2.data.data).toHaveLength(2)
          expect(response2.data.offset).toEqual(2)
        })

        it("should return product variants with their translatable fields", async () => {
          const productModule = appContainer.resolve(Modules.PRODUCT)
          await productModule.createProducts([
            {
              title: "Product with variants",
              variants: [
                { title: "Variant 1", manage_inventory: false },
                { title: "Variant 2", manage_inventory: false },
              ],
            },
          ])

          const response = await api.get(
            "/admin/translations/entities?type=product_variant",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.data).toHaveLength(2)
          expect(response.data.count).toEqual(2)

          response.data.data.forEach((variant: Record<string, unknown>) => {
            expect(variant).toHaveProperty("id")
            expect(variant.title).toBeDefined()
            expect(variant.manage_inventory).not.toBeDefined()
          })
        })

        it("should validate required type parameter", async () => {
          const response = await api
            .get("/admin/translations/entities", adminHeaders)
            .catch((e) => e.response)

          expect(response.status).toEqual(400)
        })
      })
    })
  },
})
