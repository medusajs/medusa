import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { DmlEntity, Modules } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(100000)

process.env.MEDUSA_FF_TRANSLATION = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin Translation Settings Batch API", () => {
      let mockGetTranslatableEntities: jest.SpyInstance

      beforeEach(async () => {
        mockGetTranslatableEntities = jest.spyOn(
          DmlEntity,
          "getTranslatableEntities"
        )
        mockGetTranslatableEntities.mockReturnValue([
          { entity: "ProductVariant", fields: ["title", "material"] },
          { entity: "ProductCategory", fields: ["name", "description"] },
          { entity: "ProductCollection", fields: ["title"] },
        ])
        await createAdminUser(dbConnection, adminHeaders, getContainer())

        const appContainer = getContainer()

        const translationModuleService = appContainer.resolve(
          Modules.TRANSLATION
        )
        await translationModuleService.__hooks
          ?.onApplicationStart?.()
          .catch(() => {})

        // Delete all translation settings to be able to test the create operation
        const settings =
          await translationModuleService.listTranslationSettings()
        await translationModuleService.deleteTranslationSettings(
          settings.map((s) => s.id)
        )
      })

      afterAll(async () => {
        delete process.env.MEDUSA_FF_TRANSLATION
        mockGetTranslatableEntities.mockRestore()
      })

      describe("POST /admin/translations/settings/batch", () => {
        describe("create", () => {
          it("should create a single translation setting", async () => {
            const response = await api.post(
              "/admin/translations/settings/batch",
              {
                create: [
                  {
                    entity_type: "product_variant",
                    fields: ["title", "material"],
                    is_active: true,
                  },
                ],
              },
              adminHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.created).toHaveLength(1)
            expect(response.data.created[0]).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                entity_type: "product_variant",
                fields: ["title", "material"],
                is_active: true,
                created_at: expect.any(String),
                updated_at: expect.any(String),
              })
            )
          })

          it("should create multiple translation settings", async () => {
            const response = await api.post(
              "/admin/translations/settings/batch",
              {
                create: [
                  {
                    entity_type: "product_variant",
                    fields: ["title", "material"],
                    is_active: true,
                  },
                  {
                    entity_type: "product_category",
                    fields: ["name", "description"],
                    is_active: true,
                  },
                  {
                    entity_type: "product_collection",
                    fields: ["title"],
                    is_active: false,
                  },
                ],
              },
              adminHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.created).toHaveLength(3)
            expect(response.data.created).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  entity_type: "product_variant",
                  fields: ["title", "material"],
                  is_active: true,
                }),
                expect.objectContaining({
                  entity_type: "product_category",
                  fields: ["name", "description"],
                  is_active: true,
                }),
                expect.objectContaining({
                  entity_type: "product_collection",
                  fields: ["title"],
                  is_active: false,
                }),
              ])
            )
          })
        })

        describe("update", () => {
          it("should update an existing translation setting", async () => {
            const createResponse = await api.post(
              "/admin/translations/settings/batch",
              {
                create: [
                  {
                    entity_type: "product_variant",
                    fields: ["title"],
                    is_active: true,
                  },
                ],
              },
              adminHeaders
            )

            const settingId = createResponse.data.created[0].id

            const updateResponse = await api.post(
              "/admin/translations/settings/batch",
              {
                update: [
                  {
                    id: settingId,
                    entity_type: "product_variant",
                    fields: ["title", "material"],
                  },
                ],
              },
              adminHeaders
            )

            expect(updateResponse.status).toEqual(200)
            expect(updateResponse.data.updated).toHaveLength(1)
            expect(updateResponse.data.updated[0]).toEqual(
              expect.objectContaining({
                id: settingId,
                entity_type: "product_variant",
                fields: ["title", "material"],
                is_active: true,
              })
            )
          })

          it("should update multiple translation settings", async () => {
            const createResponse = await api.post(
              "/admin/translations/settings/batch",
              {
                create: [
                  {
                    entity_type: "product_variant",
                    fields: ["title"],
                    is_active: true,
                  },
                  {
                    entity_type: "product_category",
                    fields: ["name"],
                    is_active: true,
                  },
                ],
              },
              adminHeaders
            )

            const [settingId1, settingId2] = createResponse.data.created.map(
              (s) => s.id
            )

            const updateResponse = await api.post(
              "/admin/translations/settings/batch",
              {
                update: [
                  {
                    id: settingId1,
                    entity_type: "product_variant",
                    fields: ["title", "material"],
                  },
                  {
                    id: settingId2,
                    entity_type: "product_category",
                    is_active: false,
                  },
                ],
              },
              adminHeaders
            )

            expect(updateResponse.status).toEqual(200)
            expect(updateResponse.data.updated).toHaveLength(2)
            expect(updateResponse.data.updated).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  entity_type: "product_variant",
                  fields: ["title", "material"],
                }),
                expect.objectContaining({
                  entity_type: "product_category",
                  is_active: false,
                }),
              ])
            )
          })
        })

        describe("delete", () => {
          it("should delete a translation setting", async () => {
            const createResponse = await api.post(
              "/admin/translations/settings/batch",
              {
                create: [
                  {
                    entity_type: "product_variant",
                    fields: ["title"],
                    is_active: true,
                  },
                ],
              },
              adminHeaders
            )

            const settingId = createResponse.data.created[0].id

            const deleteResponse = await api.post(
              "/admin/translations/settings/batch",
              {
                delete: [settingId],
              },
              adminHeaders
            )

            expect(deleteResponse.status).toEqual(200)
            expect(deleteResponse.data.deleted).toEqual({
              ids: [settingId],
              object: "translation_settings",
              deleted: true,
            })
          })

          it("should delete multiple translation settings", async () => {
            const createResponse = await api.post(
              "/admin/translations/settings/batch",
              {
                create: [
                  {
                    entity_type: "product_variant",
                    fields: ["title"],
                    is_active: true,
                  },
                  {
                    entity_type: "product_category",
                    fields: ["name"],
                    is_active: true,
                  },
                  {
                    entity_type: "product_collection",
                    fields: ["title"],
                    is_active: true,
                  },
                ],
              },
              adminHeaders
            )

            const ids = createResponse.data.created.map((s) => s.id)

            const deleteResponse = await api.post(
              "/admin/translations/settings/batch",
              {
                delete: ids,
              },
              adminHeaders
            )

            expect(deleteResponse.status).toEqual(200)
            expect(deleteResponse.data.deleted).toEqual({
              ids: expect.arrayContaining(ids),
              object: "translation_settings",
              deleted: true,
            })
            expect(deleteResponse.data.deleted.ids).toHaveLength(3)
          })

          it("should handle deleting with empty array", async () => {
            const response = await api.post(
              "/admin/translations/settings/batch",
              {
                delete: [],
              },
              adminHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.deleted).toEqual({
              ids: [],
              object: "translation_settings",
              deleted: true,
            })
          })
        })

        describe("combined operations", () => {
          it("should handle create, update, and delete in a single batch", async () => {
            const setupResponse = await api.post(
              "/admin/translations/settings/batch",
              {
                create: [
                  {
                    entity_type: "product_variant",
                    fields: ["title"],
                    is_active: true,
                  },
                  {
                    entity_type: "product_category",
                    fields: ["name"],
                    is_active: true,
                  },
                ],
              },
              adminHeaders
            )

            const [settingId1, settingId2] = setupResponse.data.created.map(
              (s) => s.id
            )

            const batchResponse = await api.post(
              "/admin/translations/settings/batch",
              {
                create: [
                  {
                    entity_type: "product_collection",
                    fields: ["title"],
                    is_active: true,
                  },
                ],
                update: [
                  {
                    id: settingId1,
                    entity_type: "product_variant",
                    fields: ["title", "material"],
                    is_active: false,
                  },
                ],
                delete: [settingId2],
              },
              adminHeaders
            )

            expect(batchResponse.status).toEqual(200)
            expect(batchResponse.data.created).toHaveLength(1)
            expect(batchResponse.data.updated).toHaveLength(1)
            expect(batchResponse.data.deleted.ids).toContain(settingId2)

            expect(batchResponse.data.created[0]).toEqual(
              expect.objectContaining({
                entity_type: "product_collection",
                fields: ["title"],
                is_active: true,
              })
            )

            expect(batchResponse.data.updated[0]).toEqual(
              expect.objectContaining({
                id: settingId1,
                fields: ["title", "material"],
                is_active: false,
              })
            )
          })

          it("should handle empty batch request", async () => {
            const response = await api.post(
              "/admin/translations/settings/batch",
              {
                create: [],
                update: [],
                delete: [],
              },
              adminHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.created).toEqual([])
            expect(response.data.updated).toEqual([])
            expect(response.data.deleted.ids).toEqual([])
          })
        })

        describe("validation", () => {
          it("should reject non-translatable entity types", async () => {
            const error = await api
              .post(
                "/admin/translations/settings/batch",
                {
                  create: [
                    {
                      entity_type: "NonExistentEntity",
                      fields: ["title"],
                      is_active: true,
                    },
                  ],
                },
                adminHeaders
              )
              .catch((e) => e)

            expect(error.response.status).toEqual(400)
            expect(error.response.data.message).toContain(
              "NonExistentEntity is not a translatable entity"
            )
          })

          it("should reject invalid fields for translatable entities", async () => {
            const error = await api
              .post(
                "/admin/translations/settings/batch",
                {
                  create: [
                    {
                      entity_type: "product_variant",
                      fields: ["title", "invalid_field", "another_invalid"],
                      is_active: true,
                    },
                  ],
                },
                adminHeaders
              )
              .catch((e) => e)

            expect(error.response.status).toEqual(400)
            expect(error.response.data.message).toContain("product_variant")
            expect(error.response.data.message).toContain("invalid_field")
            expect(error.response.data.message).toContain("another_invalid")
          })

          it("should reject multiple invalid settings in a single batch", async () => {
            const error = await api
              .post(
                "/admin/translations/settings/batch",
                {
                  create: [
                    {
                      entity_type: "NonExistentEntity",
                      fields: ["title"],
                      is_active: true,
                    },
                    {
                      entity_type: "product_variant",
                      fields: ["title", "invalid_field"],
                      is_active: true,
                    },
                  ],
                },
                adminHeaders
              )
              .catch((e) => e)

            expect(error.response.status).toEqual(400)
            expect(error.response.data.message).toContain(
              "NonExistentEntity is not a translatable entity"
            )
            expect(error.response.data.message).toContain("product_variant")
            expect(error.response.data.message).toContain("invalid_field")
          })

          it("should accept valid fields for translatable entities", async () => {
            const response = await api.post(
              "/admin/translations/settings/batch",
              {
                create: [
                  {
                    entity_type: "product_variant",
                    fields: ["title", "material"],
                    is_active: true,
                  },
                  {
                    entity_type: "product_category",
                    fields: ["name", "description"],
                    is_active: true,
                  },
                  {
                    entity_type: "product_collection",
                    fields: ["title"],
                    is_active: true,
                  },
                ],
              },
              adminHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.created).toHaveLength(3)
          })
        })
      })

      describe("GET /admin/translations/settings", () => {
        beforeEach(async () => {
          // Set up some translation settings for testing
          await api.post(
            "/admin/translations/settings/batch",
            {
              create: [
                {
                  entity_type: "product_variant",
                  fields: ["title"],
                  is_active: true,
                },
                {
                  entity_type: "product_category",
                  fields: ["name", "description"],
                  is_active: true,
                },
                {
                  entity_type: "product_collection",
                  fields: ["title"],
                  is_active: false,
                },
              ],
            },
            adminHeaders
          )
        })

        it("should return all translation settings", async () => {
          const response = await api.get(
            "/admin/translations/settings",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.translation_settings).toEqual({
            product_variant: expect.objectContaining({
              id: expect.any(String),
              fields: ["title"],
              inactive_fields: ["material"],
              is_active: true,
            }),
            product_category: expect.objectContaining({
              id: expect.any(String),
              fields: ["name", "description"],
              inactive_fields: [],
              is_active: true,
            }),
            product_collection: expect.objectContaining({
              id: expect.any(String),
              fields: [],
              inactive_fields: ["title"],
              is_active: false,
            }),
          })
        })

        it("should return translation settings for a specific entity type", async () => {
          const response = await api.get(
            "/admin/translations/settings?entity_type=product_variant",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.translation_settings).toEqual({
            product_variant: expect.objectContaining({
              id: expect.any(String),
              fields: ["title"],
              inactive_fields: ["material"],
              is_active: true,
            }),
          })
        })
      })

      describe("translated_field_count recomputation", () => {
        let translationModuleService: any

        beforeEach(async () => {
          translationModuleService = getContainer().resolve(Modules.TRANSLATION)
        })

        it("should recompute translated_field_count when setting is activated", async () => {
          // Create a translation setting that is inactive
          const createResponse = await api.post(
            "/admin/translations/settings/batch",
            {
              create: [
                {
                  entity_type: "product_variant",
                  fields: ["title", "material"],
                  is_active: false,
                },
              ],
            },
            adminHeaders
          )

          const settingId = createResponse.data.created[0].id

          // Create translations with both fields translated
          const translationResponse = await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "variant_1",
                  reference: "product_variant",
                  locale_code: "fr-FR",
                  translations: {
                    title: "Titre français",
                    material: "Matériau français",
                  },
                },
              ],
            },
            adminHeaders
          )

          const translationId = translationResponse.data.created[0].id

          // Initially, translated_field_count should be 0 since setting is inactive
          const initialTranslation =
            await translationModuleService.retrieveTranslation(translationId)
          expect(initialTranslation.translated_field_count).toEqual(0)

          // Activate the setting
          await api.post(
            "/admin/translations/settings/batch",
            {
              update: [
                {
                  id: settingId,
                  is_active: true,
                },
              ],
            },
            adminHeaders
          )

          // After activation, translated_field_count should be 2 (both fields are translated)
          const updatedTranslation =
            await translationModuleService.retrieveTranslation(translationId)
          expect(updatedTranslation.translated_field_count).toEqual(2)
        })

        it("should recompute translated_field_count when setting is deactivated", async () => {
          // Create an active translation setting
          const createResponse = await api.post(
            "/admin/translations/settings/batch",
            {
              create: [
                {
                  entity_type: "product_variant",
                  fields: ["title", "material"],
                  is_active: true,
                },
              ],
            },
            adminHeaders
          )

          const settingId = createResponse.data.created[0].id

          // Create translations with both fields translated
          const translationResponse = await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "variant_2",
                  reference: "product_variant",
                  locale_code: "fr-FR",
                  translations: {
                    title: "Titre français",
                    material: "Matériau français",
                  },
                },
              ],
            },
            adminHeaders
          )

          const translationId = translationResponse.data.created[0].id

          // Initially, translated_field_count should be 2 since setting is active
          const initialTranslation =
            await translationModuleService.retrieveTranslation(translationId)
          expect(initialTranslation.translated_field_count).toEqual(2)

          // Deactivate the setting
          await api.post(
            "/admin/translations/settings/batch",
            {
              update: [
                {
                  id: settingId,
                  is_active: false,
                },
              ],
            },
            adminHeaders
          )

          // After deactivation, translated_field_count should be 0
          const updatedTranslation =
            await translationModuleService.retrieveTranslation(translationId)
          expect(updatedTranslation.translated_field_count).toEqual(0)
        })

        it("should recompute translated_field_count when fields are added to setting", async () => {
          // Create a translation setting with only one field
          const createResponse = await api.post(
            "/admin/translations/settings/batch",
            {
              create: [
                {
                  entity_type: "product_variant",
                  fields: ["title"],
                  is_active: true,
                },
              ],
            },
            adminHeaders
          )

          const settingId = createResponse.data.created[0].id

          // Create translations with both fields translated
          const translationResponse = await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "variant_3",
                  reference: "product_variant",
                  locale_code: "fr-FR",
                  translations: {
                    title: "Titre français",
                    material: "Matériau français",
                  },
                },
              ],
            },
            adminHeaders
          )

          const translationId = translationResponse.data.created[0].id

          // Initially, translated_field_count should be 1 (only title is in active fields)
          const initialTranslation =
            await translationModuleService.retrieveTranslation(translationId)
          expect(initialTranslation.translated_field_count).toEqual(1)

          // Add material field to the setting
          await api.post(
            "/admin/translations/settings/batch",
            {
              update: [
                {
                  id: settingId,
                  fields: ["title", "material"],
                },
              ],
            },
            adminHeaders
          )

          // After adding material, translated_field_count should be 2
          const updatedTranslation =
            await translationModuleService.retrieveTranslation(translationId)
          expect(updatedTranslation.translated_field_count).toEqual(2)
        })

        it("should recompute translated_field_count when fields are removed from setting", async () => {
          // Create a translation setting with both fields
          const createResponse = await api.post(
            "/admin/translations/settings/batch",
            {
              create: [
                {
                  entity_type: "product_variant",
                  fields: ["title", "material"],
                  is_active: true,
                },
              ],
            },
            adminHeaders
          )

          const settingId = createResponse.data.created[0].id

          // Create translations with both fields translated
          const translationResponse = await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "variant_4",
                  reference: "product_variant",
                  locale_code: "fr-FR",
                  translations: {
                    title: "Titre français",
                    material: "Matériau français",
                  },
                },
              ],
            },
            adminHeaders
          )

          const translationId = translationResponse.data.created[0].id

          // Initially, translated_field_count should be 2
          const initialTranslation =
            await translationModuleService.retrieveTranslation(translationId)
          expect(initialTranslation.translated_field_count).toEqual(2)

          // Remove material field from the setting
          await api.post(
            "/admin/translations/settings/batch",
            {
              update: [
                {
                  id: settingId,
                  fields: ["title"],
                },
              ],
            },
            adminHeaders
          )

          // After removing material, translated_field_count should be 1
          const updatedTranslation =
            await translationModuleService.retrieveTranslation(translationId)
          expect(updatedTranslation.translated_field_count).toEqual(1)
        })

        it("should recompute translated_field_count for multiple translations when setting is updated", async () => {
          // Create a translation setting
          const createResponse = await api.post(
            "/admin/translations/settings/batch",
            {
              create: [
                {
                  entity_type: "product_variant",
                  fields: ["title"],
                  is_active: true,
                },
              ],
            },
            adminHeaders
          )

          const settingId = createResponse.data.created[0].id

          // Create multiple translations
          const translationResponse = await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "variant_5",
                  reference: "product_variant",
                  locale_code: "fr-FR",
                  translations: {
                    title: "Titre français",
                    material: "Matériau français",
                  },
                },
                {
                  reference_id: "variant_6",
                  reference: "product_variant",
                  locale_code: "de-DE",
                  translations: {
                    title: "Deutscher Titel",
                    material: "Deutsches Material",
                  },
                },
                {
                  reference_id: "variant_7",
                  reference: "product_variant",
                  locale_code: "fr-FR",
                  translations: {
                    title: "Autre titre",
                    // material not translated
                  },
                },
              ],
            },
            adminHeaders
          )

          // Store translation IDs by reference_id and locale for easy lookup
          const translationIds = {
            variant5: translationResponse.data.created.find(
              (t: any) =>
                t.reference_id === "variant_5" && t.locale_code === "fr-FR"
            )!.id,
            variant6: translationResponse.data.created.find(
              (t: any) =>
                t.reference_id === "variant_6" && t.locale_code === "de-DE"
            )!.id,
            variant7: translationResponse.data.created.find(
              (t: any) =>
                t.reference_id === "variant_7" && t.locale_code === "fr-FR"
            )!.id,
          }

          // Initially, all should have translated_field_count = 1 (only title)
          const initialVariant5 =
            await translationModuleService.retrieveTranslation(
              translationIds.variant5
            )
          const initialVariant6 =
            await translationModuleService.retrieveTranslation(
              translationIds.variant6
            )
          const initialVariant7 =
            await translationModuleService.retrieveTranslation(
              translationIds.variant7
            )

          expect(initialVariant5.translated_field_count).toEqual(1)
          expect(initialVariant6.translated_field_count).toEqual(1)
          expect(initialVariant7.translated_field_count).toEqual(1)

          // Add material field to the setting
          const updateResponse = await api.post(
            "/admin/translations/settings/batch",
            {
              update: [
                {
                  id: settingId,
                  fields: ["title", "material"],
                },
              ],
            },
            adminHeaders
          )

          // Verify the setting was updated correctly
          expect(updateResponse.data.updated[0].fields).toEqual([
            "title",
            "material",
          ])

          // After update, translations with material should have count = 2, others = 1
          // Use listTranslations to get fresh data (may be filtered but count should be correct)
          const allUpdatedTranslations =
            await translationModuleService.listTranslations({
              reference: "product_variant",
            })

          const updatedVariant5 = allUpdatedTranslations.find(
            (t: any) => t.id === translationIds.variant5
          )
          const updatedVariant6 = allUpdatedTranslations.find(
            (t: any) => t.id === translationIds.variant6
          )
          const updatedVariant7 = allUpdatedTranslations.find(
            (t: any) => t.id === translationIds.variant7
          )

          // variant_5 and variant_6 have both fields translated
          expect(updatedVariant5.translated_field_count).toEqual(2)
          expect(updatedVariant6.translated_field_count).toEqual(2)
          // variant_7 only has title translated
          expect(updatedVariant7.translated_field_count).toEqual(1)
        })

        it("should recompute translated_field_count when both is_active and fields are updated", async () => {
          // Create a translation setting that is inactive
          const createResponse = await api.post(
            "/admin/translations/settings/batch",
            {
              create: [
                {
                  entity_type: "product_category",
                  fields: ["name"],
                  is_active: false,
                },
              ],
            },
            adminHeaders
          )

          const settingId = createResponse.data.created[0].id

          // Create translations with both fields translated
          const translationResponse = await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "category_1",
                  reference: "product_category",
                  locale_code: "fr-FR",
                  translations: {
                    name: "Nom français",
                    description: "Description française",
                  },
                },
              ],
            },
            adminHeaders
          )

          const translationId = translationResponse.data.created[0].id

          // Initially, translated_field_count should be 0 since setting is inactive
          const initialTranslation =
            await translationModuleService.retrieveTranslation(translationId)
          expect(initialTranslation.translated_field_count).toEqual(0)

          // Activate the setting and add description field
          await api.post(
            "/admin/translations/settings/batch",
            {
              update: [
                {
                  id: settingId,
                  fields: ["name", "description"],
                  is_active: true,
                },
              ],
            },
            adminHeaders
          )

          // After update, translated_field_count should be 2 (both fields are translated)
          const updatedTranslation =
            await translationModuleService.retrieveTranslation(translationId)
          expect(updatedTranslation.translated_field_count).toEqual(2)
        })

        it("should handle translations with partial field translations correctly", async () => {
          // Create a translation setting with two fields
          const createResponse = await api.post(
            "/admin/translations/settings/batch",
            {
              create: [
                {
                  entity_type: "product_variant",
                  fields: ["title", "material"],
                  is_active: true,
                },
              ],
            },
            adminHeaders
          )

          const settingId = createResponse.data.created[0].id

          // Create translation with only one field translated
          const translationResponse = await api.post(
            "/admin/translations/batch",
            {
              create: [
                {
                  reference_id: "variant_8",
                  reference: "product_variant",
                  locale_code: "fr-FR",
                  translations: {
                    title: "Titre français",
                    // material not translated
                  },
                },
              ],
            },
            adminHeaders
          )

          const translationId = translationResponse.data.created[0].id

          // Initially, translated_field_count should be 1 (only title is translated)
          const initialTranslation =
            await translationModuleService.retrieveTranslation(translationId)
          expect(initialTranslation.translated_field_count).toEqual(1)

          // Remove title from the setting (only material remains)
          await api.post(
            "/admin/translations/settings/batch",
            {
              update: [
                {
                  id: settingId,
                  fields: ["material"],
                },
              ],
            },
            adminHeaders
          )

          // After update, translated_field_count should be 0 (material is not translated)
          const updatedTranslation =
            await translationModuleService.retrieveTranslation(translationId)
          expect(updatedTranslation.translated_field_count).toEqual(0)
        })
      })
    })
  },
})
