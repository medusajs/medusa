import { ITranslationModuleService } from "@medusajs/framework/types"
import { DmlEntity, Module, Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import TranslationModuleService from "@services/translation-module"
import { createLocaleFixture, createTranslationFixture } from "../__fixtures__"

jest.setTimeout(100000)

// Set up the mock before module initialization
let mockGetTranslatableEntities: jest.SpyInstance

moduleIntegrationTestRunner<ITranslationModuleService>({
  moduleName: Modules.TRANSLATION,
  hooks: {
    beforeModuleInit: async () => {
      mockGetTranslatableEntities = jest.spyOn(
        DmlEntity,
        "getTranslatableEntities"
      )
      mockGetTranslatableEntities.mockReturnValue([
        {
          entity: "Product",
          fields: ["title", "description", "subtitle", "material"],
        },
        { entity: "ProductVariant", fields: ["title", "material"] },
        { entity: "ProductCategory", fields: ["name"] },
      ])
    },
  },
  testSuite: ({ service }) => {
    describe("Translation Module Service", () => {
      beforeEach(async () => {
        await service.__hooks?.onApplicationStart?.().catch(() => {})
      })
      afterAll(() => {
        // Restore the mock after all tests complete
        mockGetTranslatableEntities.mockRestore()
      })

      it(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.TRANSLATION, {
          service: TranslationModuleService,
        }).linkable

        expect(Object.keys(linkable)).toEqual([
          "locale",
          "translation",
          "translationSettings",
        ])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({
          locale: {
            id: {
              linkable: "locale_id",
              entity: "Locale",
              primaryKey: "id",
              serviceName: "translation",
              field: "locale",
            },
          },
          translation: {
            id: {
              linkable: "translation_id",
              entity: "Translation",
              primaryKey: "id",
              serviceName: "translation",
              field: "translation",
            },
          },
          translationSettings: {
            id: {
              linkable: "translation_settings_id",
              entity: "TranslationSettings",
              primaryKey: "id",
              serviceName: "translation",
              field: "translationSettings",
            },
          },
        })
      })

      describe("Locale", () => {
        describe("creating a locale", () => {
          it("should create a locale successfully", async () => {
            const locale = await service.createLocales(createLocaleFixture)

            expect(locale).toEqual(
              expect.objectContaining({
                code: "test-LC",
                name: "Test Locale",
                created_at: expect.any(Date),
                updated_at: expect.any(Date),
              })
            )
          })

          it("should create multiple locales successfully", async () => {
            const locales = await service.createLocales([
              createLocaleFixture,
              { code: "test-LC2", name: "Test Locale 2" },
            ])

            expect(locales).toHaveLength(2)
            expect(locales[0].code).toEqual("test-LC")
            expect(locales[1].code).toEqual("test-LC2")
          })
        })

        describe("retrieving a locale", () => {
          it("should retrieve a locale by id", async () => {
            const created = await service.createLocales(createLocaleFixture)
            const retrieved = await service.retrieveLocale(created.id)

            expect(retrieved).toEqual(
              expect.objectContaining({
                id: created.id,
                code: created.code,
                name: "Test Locale",
              })
            )
          })

          it("should throw when retrieving non-existent locale", async () => {
            const error = await service
              .retrieveLocale("non-existent-id")
              .catch((e) => e)

            expect(error.message).toContain("Locale with id: non-existent-id")
          })
        })

        describe("listing locales", () => {
          it("should list all locales including defaults", async () => {
            const locales = await service.listLocales()

            expect(locales.length).toBeGreaterThanOrEqual(45)
          })

          it("should filter locales by code", async () => {
            await service.createLocales(createLocaleFixture)
            const locales = await service.listLocales({ code: "test-LC" })

            expect(locales).toHaveLength(1)
            expect(locales[0].code).toEqual("test-LC")
          })

          it("should filter locales by name", async () => {
            const locales = await service.listLocales({
              name: "English (United States)",
            })

            expect(locales).toHaveLength(1)
            expect(locales[0].code).toEqual("en-US")
          })

          it("should support pagination", async () => {
            const paginatedLocales = await service.listLocales(
              {},
              { take: 5, skip: 0 }
            )

            expect(paginatedLocales).toHaveLength(5)
          })
        })

        describe("listing and counting locales", () => {
          it("should list and count locales", async () => {
            const [locales, count] = await service.listAndCountLocales()

            expect(count).toBeGreaterThanOrEqual(45)
            expect(locales.length).toEqual(count)
          })

          it("should filter and count correctly", async () => {
            await service.createLocales([
              { code: "custom-A", name: "Custom A" },
              { code: "custom-B", name: "Custom B" },
            ])

            const [locales, count] = await service.listAndCountLocales({
              code: ["custom-A", "custom-B"],
            })

            expect(count).toEqual(2)
            expect(locales).toHaveLength(2)
          })
        })

        describe("updating a locale", () => {
          it("should update a locale successfully", async () => {
            const created = await service.createLocales(createLocaleFixture)
            const updated = await service.updateLocales({
              id: created.id,
              code: created.code,
              name: "Updated Locale Name",
            })

            expect(updated.name).toEqual("Updated Locale Name")
            expect(updated.code).toEqual("test-LC")
          })

          it("should update multiple locales", async () => {
            const created = await service.createLocales([
              { code: "upd-1", name: "Update 1" },
              { code: "upd-2", name: "Update 2" },
            ])

            const updated = await service.updateLocales([
              { id: created[0].id, code: created[0].code, name: "Updated 1" },
              { id: created[1].id, code: created[1].code, name: "Updated 2" },
            ])

            expect(updated).toHaveLength(2)
            const updatedById = updated.reduce(
              (acc, l) => ({ ...acc, [l.code]: l }),
              {} as Record<string, any>
            )
            expect(updatedById[created[0].code].name).toEqual("Updated 1")
            expect(updatedById[created[1].code].name).toEqual("Updated 2")
          })
        })

        describe("deleting a locale", () => {
          it("should delete a locale successfully", async () => {
            const created = await service.createLocales(createLocaleFixture)
            await service.deleteLocales(created.id)

            const error = await service
              .retrieveLocale(created.id)
              .catch((e) => e)

            expect(error.message).toContain("Locale with id")
          })

          it("should delete multiple locales", async () => {
            const created = await service.createLocales([
              { code: "del-1", name: "Delete 1" },
              { code: "del-2", name: "Delete 2" },
            ])

            await service.deleteLocales([created[0].id, created[1].id])

            const locales = await service.listLocales({
              code: ["del-1", "del-2"],
            })

            expect(locales).toHaveLength(0)
          })
        })

        describe("soft deleting a locale", () => {
          it("should soft delete a locale", async () => {
            const created = await service.createLocales(createLocaleFixture)
            await service.softDeleteLocales(created.id)

            const locales = await service.listLocales({ code: created.code })
            expect(locales).toHaveLength(0)
          })
        })

        describe("restoring a locale", () => {
          it("should restore a soft deleted locale", async () => {
            const created = await service.createLocales(createLocaleFixture)
            await service.softDeleteLocales(created.id)
            await service.restoreLocales(created.id)

            const restored = await service.retrieveLocale(created.id)
            expect(restored.code).toEqual(created.code)
          })
        })
      })

      describe("Translation", () => {
        describe("creating a translation", () => {
          it("should create a translation successfully", async () => {
            const translation = await service.createTranslations(
              createTranslationFixture
            )

            expect(translation).toEqual(
              expect.objectContaining({
                id: expect.stringMatching(/^trans_/),
                reference_id: "prod_123",
                reference: "product",
                locale_code: "fr-FR",
                translations: {
                  title: "Titre du produit",
                  description: "Description du produit en français",
                },
                created_at: expect.any(Date),
                updated_at: expect.any(Date),
              })
            )
          })

          it("should create multiple translations successfully", async () => {
            const translations = await service.createTranslations([
              createTranslationFixture,
              {
                reference_id: "prod_123",
                reference: "product",
                locale_code: "de-DE",
                translations: {
                  title: "Produkttitel",
                  description: "Produktbeschreibung auf Deutsch",
                },
              },
            ])

            expect(translations).toHaveLength(2)
            expect(translations[0].locale_code).toEqual("fr-FR")
            expect(translations[1].locale_code).toEqual("de-DE")
          })

          it("should fail when creating duplicate translation for same entity/type/locale", async () => {
            await service.createTranslations(createTranslationFixture)

            const error = await service
              .createTranslations(createTranslationFixture)
              .catch((e) => e)

            expect(error.message).toMatch(
              /unique|duplicate|constraint|already exists/i
            )
          })
        })

        describe("retrieving a translation", () => {
          it("should retrieve a translation by id", async () => {
            const created = await service.createTranslations(
              createTranslationFixture
            )
            const retrieved = await service.retrieveTranslation(created.id)

            expect(retrieved).toEqual(
              expect.objectContaining({
                id: created.id,
                reference_id: "prod_123",
                reference: "product",
                locale_code: "fr-FR",
              })
            )
          })

          it("should throw when retrieving non-existent translation", async () => {
            const error = await service
              .retrieveTranslation("non-existent-id")
              .catch((e) => e)

            expect(error.message).toContain(
              "Translation with id: non-existent-id"
            )
          })
        })

        describe("listing translations", () => {
          beforeEach(async () => {
            await service.createTranslations([
              {
                reference_id: "prod_1",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Produit Un" },
              },
              {
                reference_id: "prod_1",
                reference: "product",
                locale_code: "de-DE",
                translations: { title: "Produkt Eins" },
              },
              {
                reference_id: "prod_2",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Produit Deux" },
              },
              {
                reference_id: "cat_1",
                reference: "product_category",
                locale_code: "fr-FR",
                translations: { name: "Catégorie" },
              },
            ])
          })

          it("should list all translations", async () => {
            const translations = await service.listTranslations()

            expect(translations.length).toBeGreaterThanOrEqual(4)
          })

          it("should filter by reference_id", async () => {
            const translations = await service.listTranslations({
              reference_id: "prod_1",
            })

            expect(translations).toHaveLength(2)
          })

          it("should filter by reference", async () => {
            const translations = await service.listTranslations({
              reference: "product_category",
            })

            expect(translations).toHaveLength(1)
            expect(translations[0].reference_id).toEqual("cat_1")
          })

          it("should filter by locale_code", async () => {
            const translations = await service.listTranslations({
              locale_code: "de-DE",
            })

            expect(translations).toHaveLength(1)
            expect(translations[0].reference_id).toEqual("prod_1")
          })

          it("should filter by multiple criteria", async () => {
            const translations = await service.listTranslations({
              reference_id: "prod_1",
              locale_code: "fr-FR",
            })

            expect(translations).toHaveLength(1)
            expect(translations[0].translations).toEqual({
              title: "Produit Un",
            })
          })

          it("should support pagination", async () => {
            const translations = await service.listTranslations(
              {},
              { take: 2, skip: 0 }
            )

            expect(translations).toHaveLength(2)
          })
        })

        describe("listing translations with q filter (JSONB search)", () => {
          beforeEach(async () => {
            await service.createTranslations([
              {
                reference_id: "prod_search_1",
                reference: "product",
                locale_code: "fr-FR",
                translations: {
                  title: "Chaussures de sport",
                  description: "Des chaussures confortables pour le running",
                },
              },
              {
                reference_id: "prod_search_2",
                reference: "product",
                locale_code: "fr-FR",
                translations: {
                  title: "T-shirt de sport",
                  description: "Un t-shirt léger et respirant",
                },
              },
              {
                reference_id: "prod_search_3",
                reference: "product",
                locale_code: "de-DE",
                translations: {
                  title: "Sportschuhe",
                  description: "Bequeme Schuhe zum Laufen",
                },
              },
            ])
          })

          it("should search within JSONB translations field", async () => {
            const translations = await service.listTranslations({
              q: "chaussures",
            })

            expect(translations).toHaveLength(1)
            expect(translations[0].reference_id).toEqual("prod_search_1")
          })

          it("should search case-insensitively", async () => {
            const translations = await service.listTranslations({
              q: "CHAUSSURES",
            })

            expect(translations).toHaveLength(1)
          })

          it("should search across all JSONB values", async () => {
            const translations = await service.listTranslations({
              q: "running",
            })

            expect(translations).toHaveLength(1)
            expect(translations[0].reference_id).toEqual("prod_search_1")
          })

          it("should combine q filter with other filters", async () => {
            const translations = await service.listTranslations({
              q: "sport",
              locale_code: "fr-FR",
            })

            expect(translations).toHaveLength(2)
          })

          it("should return empty array when q matches nothing", async () => {
            const translations = await service.listTranslations({
              q: "nonexistent-term-xyz",
            })

            expect(translations).toHaveLength(0)
          })
        })

        describe("listing and counting translations", () => {
          beforeEach(async () => {
            await service.createTranslations([
              {
                reference_id: "cnt_1",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Un" },
              },
              {
                reference_id: "cnt_2",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Deux" },
              },
              {
                reference_id: "cnt_3",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Trois" },
              },
            ])
          })

          it("should list and count translations", async () => {
            const [translations, count] =
              await service.listAndCountTranslations({
                reference: "product",
                locale_code: "fr-FR",
              })

            expect(count).toEqual(3)
            expect(translations).toHaveLength(3)
          })

          it("should list and count with q filter", async () => {
            const [translations, count] =
              await service.listAndCountTranslations({
                q: "Deux",
              })

            expect(count).toEqual(1)
            expect(translations).toHaveLength(1)
            expect(translations[0].reference_id).toEqual("cnt_2")
          })
        })

        describe("updating a translation", () => {
          it("should update a translation successfully", async () => {
            const created = await service.createTranslations(
              createTranslationFixture
            )
            const updated = await service.updateTranslations({
              id: created.id,
              translations: {
                title: "Nouveau titre",
                description: "Nouvelle description",
              },
            })

            expect(updated.translations).toEqual({
              title: "Nouveau titre",
              description: "Nouvelle description",
            })
          })

          it("should update multiple translations", async () => {
            const created = await service.createTranslations([
              {
                reference_id: "upd_1",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Original 1" },
              },
              {
                reference_id: "upd_2",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Original 2" },
              },
            ])

            const updated = await service.updateTranslations([
              { id: created[0].id, translations: { title: "Updated 1" } },
              { id: created[1].id, translations: { title: "Updated 2" } },
            ])

            expect(updated).toHaveLength(2)
            const updatedById = updated.reduce(
              (acc, t) => ({ ...acc, [t.id]: t }),
              {} as Record<string, any>
            )
            expect(updatedById[created[0].id].translations).toEqual({
              title: "Updated 1",
            })
            expect(updatedById[created[1].id].translations).toEqual({
              title: "Updated 2",
            })
          })
        })

        describe("deleting a translation", () => {
          it("should delete a translation successfully", async () => {
            const created = await service.createTranslations(
              createTranslationFixture
            )
            await service.deleteTranslations(created.id)

            const error = await service
              .retrieveTranslation(created.id)
              .catch((e) => e)

            expect(error.message).toContain("Translation with id")
          })

          it("should delete multiple translations", async () => {
            const created = await service.createTranslations([
              {
                reference_id: "del_1",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Delete 1" },
              },
              {
                reference_id: "del_2",
                reference: "product",
                locale_code: "fr-FR",
                translations: { title: "Delete 2" },
              },
            ])

            await service.deleteTranslations([created[0].id, created[1].id])

            const translations = await service.listTranslations({
              reference_id: ["del_1", "del_2"],
            })

            expect(translations).toHaveLength(0)
          })
        })

        describe("soft deleting a translation", () => {
          it("should soft delete a translation", async () => {
            const created = await service.createTranslations(
              createTranslationFixture
            )
            await service.softDeleteTranslations(created.id)

            const translations = await service.listTranslations({
              id: created.id,
            })
            expect(translations).toHaveLength(0)
          })
        })

        describe("restoring a translation", () => {
          it("should restore a soft deleted translation", async () => {
            const created = await service.createTranslations(
              createTranslationFixture
            )
            await service.softDeleteTranslations(created.id)
            await service.restoreTranslations(created.id)

            const restored = await service.retrieveTranslation(created.id)
            expect(restored.id).toEqual(created.id)
          })
        })
      })

      describe("Settings", () => {
        describe("getTranslatableFields", () => {
          it("should return all translatable fields from database", async () => {
            const fields = await service.getTranslatableFields()

            expect(fields).toHaveProperty("product")
            expect(fields).toHaveProperty("product_variant")
            expect(fields.product).toEqual(
              expect.arrayContaining(["title", "description"])
            )
          })

          it("should return translatable fields for a specific entity type", async () => {
            const fields = await service.getTranslatableFields("product")

            expect(Object.keys(fields)).toEqual(["product"])
            expect(fields.product).toEqual(
              expect.arrayContaining(["title", "description"])
            )
          })

          it("should return empty object for unknown entity type", async () => {
            const fields = await service.getTranslatableFields("unknown_entity")

            expect(fields).toEqual({})
          })

          it("should return empty array when entity has fields configured but is_active is false", async () => {
            const [productTranslationSettings] =
              await service.listTranslationSettings({
                entity_type: "product",
              })
            await service.updateTranslationSettings({
              id: productTranslationSettings.id,
              is_active: false,
            })

            const fields = await service.getTranslatableFields("product")

            expect(fields).toEqual({
              product: [],
            })
          })

          it("should return empty array for inactive entity when getting all fields", async () => {
            const [productTranslationSettings] =
              await service.listTranslationSettings({
                entity_type: "product",
              })
            await service.updateTranslationSettings({
              id: productTranslationSettings.id,
              is_active: false,
            })

            const fields = await service.getTranslatableFields()

            expect(fields.product).toEqual([])
          })
        })

        describe("listing translations filters by configured fields", () => {
          it("should only return configured fields in translations", async () => {
            await service.createTranslations({
              reference_id: "prod_filter_1",
              reference: "product",
              locale_code: "en-US",
              translations: {
                title: "Product Title",
                description: "Product Description",
                unconfigured_field: "Should be filtered out",
              },
            })

            const translations = await service.listTranslations({
              reference_id: "prod_filter_1",
            })

            expect(translations).toHaveLength(1)
            expect(translations[0].translations).toHaveProperty("title")
            expect(translations[0].translations).toHaveProperty("description")
            expect(translations[0].translations).not.toHaveProperty(
              "unconfigured_field"
            )
          })

          it("should return empty translations for unconfigured entity types", async () => {
            await service.createTranslations({
              reference_id: "unconfigured_1",
              reference: "unconfigured_entity",
              locale_code: "en-US",
              translations: {
                field1: "Value 1",
                field2: "Value 2",
              },
            })

            const translations = await service.listTranslations({
              reference_id: "unconfigured_1",
            })

            expect(translations).toHaveLength(1)
            expect(translations[0].translations).toEqual({})
          })
        })
      })

      describe("Statistics", () => {
        describe("getStatistics", () => {
          it("should return statistics for a single entity type and locale", async () => {
            await service.createTranslations([
              {
                reference_id: "prod_stat_1",
                reference: "product",
                locale_code: "en-US",
                translations: {
                  title: "Product 1",
                  description: "Description 1",
                  // material and subtitle are missing
                },
              },
              {
                reference_id: "prod_stat_2",
                reference: "product",
                locale_code: "en-US",
                translations: {
                  title: "Product 2",
                  description: "Description 2",
                  subtitle: "Subtitle 2",
                },
              },
            ])

            const stats = await service.getStatistics({
              locales: ["en-US"],
              entities: {
                product: { count: 2 },
              },
            })

            // Expected: 2 products × 4 fields × 1 locale = 8
            // Translated: prod_1 has 2, prod_2 has 3 = 5
            expect(stats.product).toEqual({
              expected: 8,
              translated: 5,
              missing: 3,
              by_locale: {
                "en-US": {
                  expected: 8,
                  translated: 5,
                  missing: 3,
                },
              },
            })
          })

          it("should return statistics for multiple locales", async () => {
            await service.createTranslations([
              {
                reference_id: "prod_multi_1",
                reference: "product",
                locale_code: "en-US",
                translations: {
                  title: "Product 1 EN",
                  description: "Description EN",
                },
              },
              {
                reference_id: "prod_multi_1",
                reference: "product",
                locale_code: "fr-FR",
                translations: {
                  title: "Produit 1 FR",
                  // only title translated for French
                },
              },
            ])

            const stats = await service.getStatistics({
              locales: ["en-US", "fr-FR"],
              entities: {
                product: { count: 1 },
              },
            })

            // Expected per locale: 1 product × 4 fields = 4
            // Total expected: 4 × 2 locales = 8
            expect(stats.product.expected).toEqual(8)
            expect(stats.product.translated).toEqual(3) // 2 EN + 1 FR
            expect(stats.product.missing).toEqual(5)

            expect(stats.product.by_locale["en-US"]).toEqual({
              expected: 4,
              translated: 2,
              missing: 2,
            })

            expect(stats.product.by_locale["fr-FR"]).toEqual({
              expected: 4,
              translated: 1,
              missing: 3,
            })
          })

          it("should return statistics for multiple entity types", async () => {
            await service.createTranslations([
              {
                reference_id: "prod_type_1",
                reference: "product",
                locale_code: "en-US",
                translations: {
                  title: "Product Title",
                  description: "Product Description",
                  subtitle: "Product Subtitle",
                  material: "Product Material",
                },
              },
              {
                reference_id: "var_type_1",
                reference: "product_variant",
                locale_code: "en-US",
                translations: {
                  title: "Variant Title",
                  // material missing
                },
              },
            ])

            const stats = await service.getStatistics({
              locales: ["en-US"],
              entities: {
                product: { count: 1 },
                product_variant: { count: 1 },
              },
            })

            // Product: 1 × 4 fields = 4 expected, 4 translated
            expect(stats.product).toEqual({
              expected: 4,
              translated: 4,
              missing: 0,
              by_locale: {
                "en-US": { expected: 4, translated: 4, missing: 0 },
              },
            })

            // Variant: 1 × 2 fields = 2 expected, 1 translated
            expect(stats.product_variant).toEqual({
              expected: 2,
              translated: 1,
              missing: 1,
              by_locale: {
                "en-US": { expected: 2, translated: 1, missing: 1 },
              },
            })
          })

          it("should return zeros for entity types not in config", async () => {
            const stats = await service.getStatistics({
              locales: ["en-US"],
              entities: {
                unknown_entity: { count: 10 },
              },
            })

            expect(stats.unknown_entity).toEqual({
              expected: 0,
              translated: 0,
              missing: 0,
              by_locale: {
                "en-US": { expected: 0, translated: 0, missing: 0 },
              },
            })
          })

          it("should return all missing when no translations exist", async () => {
            const stats = await service.getStatistics({
              locales: ["en-US", "fr-FR"],
              entities: {
                product: { count: 5 },
              },
            })

            // 5 products × 4 fields × 2 locales = 40 expected, 0 translated
            expect(stats.product).toEqual({
              expected: 40,
              translated: 0,
              missing: 40,
              by_locale: {
                "en-US": { expected: 20, translated: 0, missing: 20 },
                "fr-FR": { expected: 20, translated: 0, missing: 20 },
              },
            })
          })

          it("should ignore empty string and null values in translations", async () => {
            await service.createTranslations([
              {
                reference_id: "prod_empty_1",
                reference: "product",
                locale_code: "en-US",
                translations: {
                  title: "Valid Title",
                  description: "", // empty string should not count
                  subtitle: "Valid Subtitle",
                },
              },
            ])

            const stats = await service.getStatistics({
              locales: ["en-US"],
              entities: {
                product: { count: 1 },
              },
            })

            // Only title and subtitle count (2), not empty description
            expect(stats.product.translated).toEqual(2)
            expect(stats.product.missing).toEqual(2)
          })

          it("should normalize locale codes", async () => {
            await service.createTranslations([
              {
                reference_id: "prod_norm_1",
                reference: "product",
                locale_code: "en-us",
                translations: {
                  title: "Product Title",
                },
              },
            ])

            const stats = await service.getStatistics({
              locales: ["EN-US"],
              entities: {
                product: { count: 1 },
              },
            })

            expect(stats.product.translated).toEqual(1)
          })

          it("should throw error when no locales provided", async () => {
            const error = await service
              .getStatistics({
                locales: [],
                entities: { product: { count: 1 } },
              })
              .catch((e) => e)

            expect(error.message).toContain(
              "At least one locale must be provided"
            )
          })

          it("should throw error when no entities provided", async () => {
            const error = await service
              .getStatistics({
                locales: ["en-US"],
                entities: {},
              })
              .catch((e) => e)

            expect(error.message).toContain(
              "At least one entity type must be provided"
            )
          })

          it("should handle large entity counts correctly", async () => {
            // This tests that the expected calculation works with large numbers
            // without actually creating that many translations
            const stats = await service.getStatistics({
              locales: ["en-US", "fr-FR", "de-DE"],
              entities: {
                product: { count: 10000 },
                product_variant: { count: 50000 },
              },
            })

            // Product: 10000 × 4 fields × 3 locales = 120000
            expect(stats.product.expected).toEqual(120000)
            expect(stats.product.translated).toEqual(0)
            expect(stats.product.missing).toEqual(120000)

            // Variant: 50000 × 2 fields × 3 locales = 300000
            expect(stats.product_variant.expected).toEqual(300000)
            expect(stats.product_variant.translated).toEqual(0)
            expect(stats.product_variant.missing).toEqual(300000)
          })

          it("should update statistics after translation is updated", async () => {
            const created = await service.createTranslations({
              reference_id: "prod_update_stat_1",
              reference: "product",
              locale_code: "en-US",
              translations: {
                title: "Product Title",
                // only 1 of 4 fields
              },
            })

            let stats = await service.getStatistics({
              locales: ["en-US"],
              entities: { product: { count: 1 } },
            })
            expect(stats.product.translated).toEqual(1)

            await service.updateTranslations({
              id: created.id,
              translations: {
                title: "Product Title",
                description: "Product Description",
                subtitle: "Product Subtitle",
              },
            })

            stats = await service.getStatistics({
              locales: ["en-US"],
              entities: { product: { count: 1 } },
            })
            expect(stats.product.translated).toEqual(3)
            expect(stats.product.missing).toEqual(1)
          })
        })
      })
    })
  },
})
