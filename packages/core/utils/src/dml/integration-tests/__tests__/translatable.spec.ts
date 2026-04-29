import { MetadataStorage } from "@medusajs/deps/mikro-orm/core"
import { DmlEntity } from "../../entity"
import { model } from "../../entity-builder"
import { mikroORMEntityBuilder } from "../../helpers/create-mikro-orm-entity"

describe("Translatable", () => {
  beforeEach(() => {
    MetadataStorage.clear()
    mikroORMEntityBuilder.clear()
    DmlEntity.clearTranslatableEntities()
  })

  describe("getTranslatableEntities", () => {
    it("should collect translatable fields from a single entity", () => {
      model.define("ProductVariant", {
        id: model.id().primaryKey(),
        name: model.text().translatable(),
        default_sales_channel_id: model.text().nullable(),
      })

      const translatables = DmlEntity.getTranslatableEntities()

      expect(translatables).toContainEqual({
        entity: "ProductVariant",
        fields: ["name"],
      })
    })

    it("should collect multiple translatable fields from a single entity", () => {
      model.define("product", {
        id: model.id().primaryKey(),
        title: model.text().translatable(),
        description: model.text().translatable(),
        handle: model.text(),
      })

      const translatables = DmlEntity.getTranslatableEntities()

      expect(translatables).toContainEqual({
        entity: "Product",
        fields: ["title", "description"],
      })
    })

    it("should collect translatable fields from multiple entities", () => {
      model.define("store", {
        id: model.id().primaryKey(),
        name: model.text().translatable(),
      })

      model.define("product", {
        id: model.id().primaryKey(),
        title: model.text().translatable(),
      })

      model.define("region", {
        id: model.id().primaryKey(),
        name: model.text().translatable(),
        currency_code: model.text(),
      })

      const translatables = DmlEntity.getTranslatableEntities()

      expect(translatables).toContainEqual({
        entity: "Store",
        fields: ["name"],
      })
      expect(translatables).toContainEqual({
        entity: "Product",
        fields: ["title"],
      })
      expect(translatables).toContainEqual({
        entity: "Region",
        fields: ["name"],
      })
    })

    it("should not include entities without translatable fields", () => {
      model.define("store", {
        id: model.id().primaryKey(),
        name: model.text().translatable(),
      })

      model.define("currency", {
        id: model.id().primaryKey(),
        code: model.text(),
        symbol: model.text(),
      })

      const translatables = DmlEntity.getTranslatableEntities()

      expect(translatables).toContainEqual({
        entity: "Store",
        fields: ["name"],
      })

      const currencyEntry = translatables.find((e) => e.entity === "Currency")
      expect(currencyEntry).toBeUndefined()
    })

    it("should work with translatable chained with other modifiers", () => {
      model.define("product", {
        id: model.id().primaryKey(),
        title: model.text().searchable().translatable(),
        subtitle: model.text().translatable().nullable(),
        description: model.text().default("No description").translatable(),
      })

      const translatables = DmlEntity.getTranslatableEntities()

      expect(translatables).toContainEqual({
        entity: "Product",
        fields: ["title", "subtitle", "description"],
      })
    })

    it("should use PascalCase entity name", () => {
      model.define("product_category", {
        id: model.id().primaryKey(),
        name: model.text().translatable(),
      })

      const translatables = DmlEntity.getTranslatableEntities()

      expect(translatables).toContainEqual({
        entity: "ProductCategory",
        fields: ["name"],
      })
    })

    it("should use name from config object", () => {
      model.define(
        { name: "ProductCategory", tableName: "product_category" },
        {
          id: model.id().primaryKey(),
          name: model.text().translatable(),
        }
      )

      const translatables = DmlEntity.getTranslatableEntities()

      expect(translatables).toContainEqual({
        entity: "ProductCategory",
        fields: ["name"],
      })
    })

    it("should return a copy of the translatable entities array", () => {
      model.define("store", {
        id: model.id().primaryKey(),
        name: model.text().translatable(),
      })

      const translatables1 = DmlEntity.getTranslatableEntities()
      const translatables2 = DmlEntity.getTranslatableEntities()

      expect(translatables1).not.toBe(translatables2)
      expect(translatables1).toEqual(translatables2)
    })
  })
})
