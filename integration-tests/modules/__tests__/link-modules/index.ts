import { initialize, runMigrations } from "@medusajs/link-modules"
import { MedusaModule, ModuleJoinerConfig } from "@medusajs/modules-sdk"
import { medusaIntegrationTestRunner } from "medusa-test-utils/dist"

jest.setTimeout(5000000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer, dbConfig: { clientUrl } }) => {
    let DB_URL
    let container
    let links

    beforeAll(async () => {
      DB_URL = clientUrl
      container = getContainer()

      const linkDefinition: ModuleJoinerConfig[] = [
        {
          serviceName: "linkServiceName",
          isLink: true,
          databaseConfig: {
            tableName: "linkTableName",
            idPrefix: "prefix",
            extraFields: {
              extra_field: {
                type: "integer",
                defaultValue: "-1",
              },
              another_field: {
                type: "string",
                nullable: true,
              },
            },
          },
          relationships: [
            {
              serviceName: "moduleA",
              primaryKey: "id",
              foreignKey: "product_id",
              alias: "product",
            },
            {
              serviceName: "moduleB",
              primaryKey: "id",
              foreignKey: "inventory_item_id",
              alias: "inventory",
            },
          ],
        },
      ]
      const dbConfig = {
        database: {
          clientUrl: DB_URL,
        },
      }

      jest.spyOn(MedusaModule, "getLoadedModules").mockImplementation((() => {
        return [
          {
            moduleA: {
              __definition: {
                key: "moduleA",
              },
            },
          },
          {
            moduleB: {
              __definition: {
                key: "moduleB",
              },
            },
          },
        ]
      }) as any)

      await runMigrations({ options: dbConfig }, linkDefinition)
      links = await initialize(dbConfig, linkDefinition)
    })

    afterAll(async () => {
      jest.clearAllMocks()
    })

    describe("Link Modules", () => {
      it("Should insert values in a declared link", async function () {
        // simple
        await links.linkServiceName.create("modA_id", "modB_id")

        // extra fields
        await links.linkServiceName.create("123", "abc", {
          extra_field: 333,
          another_field: "value**",
        })

        // bulk
        await links.linkServiceName.create([
          ["111", "aaa", { another_field: "test" }],
          ["222", "bbb"],
          ["333", "ccc", { extra_field: 2 }],
          ["444", "bbb"],
        ])

        const values = await links.linkServiceName.list()

        expect(values).toEqual([
          {
            product_id: "modA_id",
            inventory_item_id: "modB_id",
            id: expect.stringMatching("prefix_.+"),
            extra_field: -1,
            another_field: null,
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            deleted_at: null,
          },
          expect.objectContaining({
            product_id: "123",
            inventory_item_id: "abc",
            id: expect.stringMatching("prefix_.+"),
            extra_field: 333,
            another_field: "value**",
          }),
          expect.objectContaining({
            product_id: "111",
            inventory_item_id: "aaa",
            extra_field: -1,
            another_field: "test",
          }),
          expect.objectContaining({
            product_id: "222",
            inventory_item_id: "bbb",
            extra_field: -1,
            another_field: null,
          }),
          expect.objectContaining({
            product_id: "333",
            inventory_item_id: "ccc",
            id: expect.stringMatching("prefix_.+"),
            extra_field: 2,
          }),
          expect.objectContaining({
            product_id: "444",
            inventory_item_id: "bbb",
          }),
        ])
      })

      it("Should dismiss the link of a given pair of keys", async function () {
        // simple
        await links.linkServiceName.create("modA_id", "modB_id")

        // extra fields
        await links.linkServiceName.create("123", "abc", {
          extra_field: 333,
          another_field: "value**",
        })

        // bulk
        await links.linkServiceName.create([
          ["111", "aaa", { another_field: "test" }],
          ["222", "bbb"],
          ["333", "ccc", { extra_field: 2 }],
          ["444", "bbb"],
        ])

        // simple
        const dismissSingle = await links.linkServiceName.dismiss(
          "modA_id",
          "modB_id"
        )

        // bulk
        const dismissMulti = await links.linkServiceName.dismiss([
          ["111", "aaa"],
          ["333", "ccc"],
        ])

        expect(dismissSingle).toEqual([
          expect.objectContaining({
            product_id: "modA_id",
            inventory_item_id: "modB_id",
            deleted_at: expect.any(Date),
          }),
        ])

        expect(dismissMulti).toEqual([
          expect.objectContaining({
            product_id: "111",
            inventory_item_id: "aaa",
            deleted_at: expect.any(Date),
          }),
          expect.objectContaining({
            product_id: "333",
            inventory_item_id: "ccc",
            deleted_at: expect.any(Date),
          }),
        ])
      })

      it("Should delete all the links related to a given key", async function () {
        // simple
        await links.linkServiceName.create("modA_id", "modB_id")

        // extra fields
        await links.linkServiceName.create("123", "abc", {
          extra_field: 333,
          another_field: "value**",
        })

        // bulk
        await links.linkServiceName.create([
          ["111", "aaa", { another_field: "test" }],
          ["222", "bbb"],
          ["333", "ccc", { extra_field: 2 }],
          ["444", "bbb"],
        ])

        await links.linkServiceName.softDelete({
          inventory_item_id: "bbb",
        })

        const values = await links.linkServiceName.list(
          { inventory_item_id: "bbb" },
          { withDeleted: true }
        )

        expect(values).toEqual([
          expect.objectContaining({
            product_id: "222",
            inventory_item_id: "bbb",
            deleted_at: expect.any(Date),
          }),
          expect.objectContaining({
            product_id: "444",
            inventory_item_id: "bbb",
            deleted_at: expect.any(Date),
          }),
        ])
      })

      it("Should dismiss the link of a given pair of keys and recreate it", async function () {
        await links.linkServiceName.create("123", "abc", {
          extra_field: 333,
          another_field: "value**",
        })

        await links.linkServiceName.dismiss("123", "abc")

        const values = await links.linkServiceName.list()

        expect(values).toHaveLength(0)

        await links.linkServiceName.create("123", "abc", {
          another_field: "changed",
        })

        const values2 = await links.linkServiceName.list()

        expect(values2).toEqual([
          expect.objectContaining({
            product_id: "123",
            inventory_item_id: "abc",
            extra_field: 333,
            another_field: "changed",
            deleted_at: null,
          }),
        ])
      })
    })
  },
})
