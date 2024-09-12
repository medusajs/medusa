import { expectTypeOf } from "expect-type"
import { upperCaseFirst } from "../../common"
import { model } from "../../dml"
import {
  dmlFulfillment,
  dmlFulfillmentProvider,
  dmlFulfillmentSet,
  dmlGeoZone,
  dmlServiceZone,
  dmlShippingOption,
  dmlShippingOptionRule,
  dmlShippingProfile,
  Fulfillment,
  FulfillmentProvider,
  FulfillmentSet,
  GeoZone,
  ServiceZone,
  ShippingOption,
  ShippingOptionRule,
  ShippingProfile,
} from "../__fixtures__/joiner-config/entities"
import { Modules } from "../definition"
import {
  buildLinkableKeysFromDmlObjects,
  buildLinkableKeysFromMikroOrmObjects,
  buildLinkConfigFromLinkableKeys,
  buildLinkConfigFromModelObjects,
  defineJoinerConfig,
} from "../joiner-config-builder"

describe("joiner-config-builder", () => {
  describe("defineJoiner | Mikro orm objects", () => {
    it("should return a full joiner configuration", () => {
      const joinerConfig = defineJoinerConfig(Modules.FULFILLMENT, {
        models: [
          FulfillmentSet,
          ShippingOption,
          ShippingProfile,
          Fulfillment,
          FulfillmentProvider,
          ServiceZone,
          GeoZone,
          ShippingOptionRule,
        ],
      })

      expect(joinerConfig).toEqual({
        serviceName: Modules.FULFILLMENT,
        primaryKeys: ["id"],
        schema: "",
        linkableKeys: {
          fulfillment_set_id: FulfillmentSet.name,
          shipping_option_id: ShippingOption.name,
          shipping_profile_id: ShippingProfile.name,
          fulfillment_id: Fulfillment.name,
          fulfillment_provider_id: FulfillmentProvider.name,
          service_zone_id: ServiceZone.name,
          geo_zone_id: GeoZone.name,
          shipping_option_rule_id: ShippingOptionRule.name,
        },
        alias: [
          {
            name: ["fulfillment_set", "fulfillment_sets"],
            entity: FulfillmentSet.name,
            args: {
              methodSuffix: "FulfillmentSets",
            },
          },
          {
            name: ["shipping_option", "shipping_options"],
            entity: ShippingOption.name,
            args: {
              methodSuffix: "ShippingOptions",
            },
          },
          {
            name: ["shipping_profile", "shipping_profiles"],
            entity: ShippingProfile.name,
            args: {
              methodSuffix: "ShippingProfiles",
            },
          },
          {
            name: ["fulfillment", "fulfillments"],
            entity: Fulfillment.name,
            args: {
              methodSuffix: "Fulfillments",
            },
          },
          {
            name: ["fulfillment_provider", "fulfillment_providers"],
            entity: FulfillmentProvider.name,
            args: {
              methodSuffix: "FulfillmentProviders",
            },
          },
          {
            name: ["service_zone", "service_zones"],
            entity: ServiceZone.name,
            args: {
              methodSuffix: "ServiceZones",
            },
          },
          {
            name: ["geo_zone", "geo_zones"],
            entity: GeoZone.name,
            args: {
              methodSuffix: "GeoZones",
            },
          },
          {
            name: ["shipping_option_rule", "shipping_option_rules"],
            entity: ShippingOptionRule.name,
            args: {
              methodSuffix: "ShippingOptionRules",
            },
          },
        ],
      })
    })

    it("should return a full joiner configuration with custom aliases", () => {
      const joinerConfig = defineJoinerConfig(Modules.FULFILLMENT, {
        alias: [
          {
            name: ["custom", "customs"],
            entity: "Custom",
            args: {
              methodSuffix: "Customs",
            },
          },
        ],
      })

      expect(joinerConfig).toEqual({
        serviceName: Modules.FULFILLMENT,
        primaryKeys: ["id"],
        schema: "",
        linkableKeys: {},
        alias: [
          {
            name: ["custom", "customs"],
            entity: "Custom",
            args: {
              methodSuffix: "Customs",
            },
          },
        ],
      })
    })

    it("should return a full joiner configuration with custom aliases and models", () => {
      const joinerConfig = defineJoinerConfig(Modules.FULFILLMENT, {
        models: [
          FulfillmentSet,
          ShippingOption,
          ShippingProfile,
          Fulfillment,
          FulfillmentProvider,
          ServiceZone,
          GeoZone,
          ShippingOptionRule,
        ],
        alias: [
          {
            name: ["custom", "customs"],
            entity: "Custom",
            args: {
              methodSuffix: "Customs",
            },
          },
        ],
      })

      expect(joinerConfig).toEqual({
        serviceName: Modules.FULFILLMENT,
        primaryKeys: ["id"],
        schema: "",
        linkableKeys: {
          fulfillment_set_id: FulfillmentSet.name,
          shipping_option_id: ShippingOption.name,
          shipping_profile_id: ShippingProfile.name,
          fulfillment_id: Fulfillment.name,
          fulfillment_provider_id: FulfillmentProvider.name,
          service_zone_id: ServiceZone.name,
          geo_zone_id: GeoZone.name,
          shipping_option_rule_id: ShippingOptionRule.name,
        },
        alias: [
          {
            name: ["custom", "customs"],
            entity: "Custom",
            args: {
              methodSuffix: "Customs",
            },
          },
          {
            name: ["fulfillment_set", "fulfillment_sets"],
            entity: FulfillmentSet.name,
            args: {
              methodSuffix: "FulfillmentSets",
            },
          },
          {
            name: ["shipping_option", "shipping_options"],
            entity: ShippingOption.name,
            args: {
              methodSuffix: "ShippingOptions",
            },
          },
          {
            name: ["shipping_profile", "shipping_profiles"],
            entity: ShippingProfile.name,
            args: {
              methodSuffix: "ShippingProfiles",
            },
          },
          {
            name: ["fulfillment", "fulfillments"],
            entity: Fulfillment.name,
            args: {
              methodSuffix: "Fulfillments",
            },
          },
          {
            name: ["fulfillment_provider", "fulfillment_providers"],
            entity: FulfillmentProvider.name,
            args: {
              methodSuffix: "FulfillmentProviders",
            },
          },
          {
            name: ["service_zone", "service_zones"],
            entity: ServiceZone.name,
            args: {
              methodSuffix: "ServiceZones",
            },
          },
          {
            name: ["geo_zone", "geo_zones"],
            entity: GeoZone.name,
            args: {
              methodSuffix: "GeoZones",
            },
          },
          {
            name: ["shipping_option_rule", "shipping_option_rules"],
            entity: ShippingOptionRule.name,
            args: {
              methodSuffix: "ShippingOptionRules",
            },
          },
        ],
      })
    })

    it("should return a full joiner configuration with custom aliases without method suffix", () => {
      const joinerConfig = defineJoinerConfig(Modules.FULFILLMENT, {
        alias: [
          {
            name: ["custom", "customs"],
            entity: "Custom",
            args: {},
          },
        ],
      })

      expect(joinerConfig).toEqual({
        serviceName: Modules.FULFILLMENT,
        primaryKeys: ["id"],
        schema: "",
        linkableKeys: {},
        alias: [
          {
            name: ["custom", "customs"],
            entity: "Custom",
            args: {
              methodSuffix: "Customs",
            },
          },
        ],
      })
    })

    it.only("should return a full joiner configuration with custom aliases overriding defaults", () => {
      const joinerConfig = defineJoinerConfig(Modules.FULFILLMENT, {
        models: [FulfillmentSet],
        alias: [
          {
            name: ["fulfillment_set", "fulfillment_sets"],
            entity: "FulfillmentSet",
            args: {
              methodSuffix: "fulfillmentSetCustom",
            },
          },
        ],
      })

      expect(joinerConfig).toEqual({
        serviceName: Modules.FULFILLMENT,
        primaryKeys: ["id"],
        schema: "",
        linkableKeys: {
          fulfillment_set_id: FulfillmentSet.name,
        },
        alias: [
          {
            name: ["fulfillment_set", "fulfillment_sets"],
            entity: "FulfillmentSet",
            args: {
              methodSuffix: "fulfillmentSetCustom",
            },
          },
        ],
      })
    })
  })

  describe("defineJoiner | DML objects", () => {
    it("should return a full joiner configuration", () => {
      const joinerConfig = defineJoinerConfig(Modules.FULFILLMENT, {
        models: [
          dmlFulfillmentSet,
          dmlShippingOption,
          dmlShippingProfile,
          dmlFulfillment,
          dmlFulfillmentProvider,
          dmlServiceZone,
          dmlGeoZone,
          dmlShippingOptionRule,
        ],
      })

      expect(joinerConfig).toEqual({
        serviceName: Modules.FULFILLMENT,
        primaryKeys: ["id"],
        schema: expect.any(String),
        linkableKeys: {
          fulfillment_set_id: FulfillmentSet.name,
          shipping_option_id: ShippingOption.name,
          shipping_profile_id: ShippingProfile.name,
          fulfillment_id: Fulfillment.name,
          fulfillment_provider_id: FulfillmentProvider.name,
          service_zone_id: ServiceZone.name,
          geo_zone_id: GeoZone.name,
          shipping_option_rule_id: ShippingOptionRule.name,
        },
        alias: [
          {
            name: ["fulfillment_set", "fulfillment_sets"],
            entity: FulfillmentSet.name,
            args: {
              methodSuffix: "FulfillmentSets",
            },
          },
          {
            name: ["shipping_option", "shipping_options"],
            entity: ShippingOption.name,
            args: {
              methodSuffix: "ShippingOptions",
            },
          },
          {
            name: ["shipping_profile", "shipping_profiles"],
            entity: ShippingProfile.name,
            args: {
              methodSuffix: "ShippingProfiles",
            },
          },
          {
            name: ["fulfillment", "fulfillments"],
            entity: Fulfillment.name,
            args: {
              methodSuffix: "Fulfillments",
            },
          },
          {
            name: ["fulfillment_provider", "fulfillment_providers"],
            entity: FulfillmentProvider.name,
            args: {
              methodSuffix: "FulfillmentProviders",
            },
          },
          {
            name: ["service_zone", "service_zones"],
            entity: ServiceZone.name,
            args: {
              methodSuffix: "ServiceZones",
            },
          },
          {
            name: ["geo_zone", "geo_zones"],
            entity: GeoZone.name,
            args: {
              methodSuffix: "GeoZones",
            },
          },
          {
            name: ["shipping_option_rule", "shipping_option_rules"],
            entity: ShippingOptionRule.name,
            args: {
              methodSuffix: "ShippingOptionRules",
            },
          },
        ],
      })

      const schemaExpected = `type FulfillmentSet {
            id: ID!
            created_at: DateTime!
            updated_at: DateTime!
            deleted_at: DateTime
          }
          type ShippingOption {
            id: ID!
            created_at: DateTime!
            updated_at: DateTime!
            deleted_at: DateTime
          }
          type ShippingProfile {
            id: ID!
            created_at: DateTime!
            updated_at: DateTime!
            deleted_at: DateTime
          }
          type Fulfillment {
            id: ID!
            created_at: DateTime!
            updated_at: DateTime!
            deleted_at: DateTime
          }
          type FulfillmentProvider {
            id: ID!
            created_at: DateTime!
            updated_at: DateTime!
            deleted_at: DateTime
          }
          type ServiceZone {
            id: ID!
            created_at: DateTime!
            updated_at: DateTime!
            deleted_at: DateTime
          }
          type GeoZone {
            id: ID!
            created_at: DateTime!
            updated_at: DateTime!
            deleted_at: DateTime
          }
          type ShippingOptionRule {
            id: ID!
            created_at: DateTime!
            updated_at: DateTime!
            deleted_at: DateTime
          }`

      expect(joinerConfig.schema!.replace(/\s/g, "")).toEqual(
        schemaExpected.replace(/\s/g, "")
      )
    })
  })

  describe("buildLinkableKeysFromDmlObjects", () => {
    it("should return a linkableKeys object based on the DML's primary keys", () => {
      const user = model.define("user", {
        id: model.id().primaryKey(),
        name: model.text(),
      })

      const car = model.define("car", {
        id: model.id(),
        number_plate: model.text().primaryKey(),
        test: model.text(),
      })

      const linkableKeys = buildLinkableKeysFromDmlObjects([user, car])

      expectTypeOf(linkableKeys).toMatchTypeOf<{
        user_id: "User"
        car_number_plate: "Car"
      }>()

      expect(linkableKeys).toEqual({
        user_id: upperCaseFirst(user.name),
        car_number_plate: upperCaseFirst(car.name),
      })
    })
  })

  describe("buildLinkableKeysFromMikroOrmObjects", () => {
    it("should return a linkableKeys object based on the mikro orm models name", () => {
      class User {}
      class Car {}

      const linkableKeys = buildLinkableKeysFromMikroOrmObjects([Car, User])

      expect(linkableKeys).toEqual({
        user_id: User.name,
        car_id: Car.name,
      })
    })
  })

  describe("buildLinkConfigFromLinkableKeys", () => {
    it("should return a link config object based on the linkable keys", () => {
      class User {}
      class Car {}

      const linkableKeys = buildLinkableKeysFromMikroOrmObjects([Car, User])

      const linkConfig = buildLinkConfigFromLinkableKeys(
        "myService",
        linkableKeys
      )

      expect(linkConfig).toEqual({
        car: {
          id: {
            field: "car",
            entity: "Car",
            linkable: "car_id",
            primaryKey: "id",
            serviceName: "myService",
          },
          toJSON: expect.any(Function),
        },
        user: {
          id: {
            field: "user",
            entity: "User",
            linkable: "user_id",
            primaryKey: "id",
            serviceName: "myService",
          },
          toJSON: expect.any(Function),
        },
      })

      expect(linkConfig.car.toJSON()).toEqual({
        field: "car",
        entity: "Car",
        linkable: "car_id",
        primaryKey: "id",
        serviceName: "myService",
      })
      expect(linkConfig.user.toJSON()).toEqual({
        field: "user",
        entity: "User",
        linkable: "user_id",
        primaryKey: "id",
        serviceName: "myService",
      })
    })

    it("should return a link config object based on the custom linkable keys", () => {
      const linkConfig = buildLinkConfigFromLinkableKeys("myService", {
        user_id: "User",
        currency_code: "currency",
      })

      expect(linkConfig).toEqual({
        user: {
          id: {
            field: "user",
            entity: "User",
            linkable: "user_id",
            primaryKey: "id",
            serviceName: "myService",
          },
          toJSON: expect.any(Function),
        },
        currency: {
          code: {
            field: "currency",
            entity: "Currency",
            linkable: "currency_code",
            primaryKey: "code",
            serviceName: "myService",
          },
          toJSON: expect.any(Function),
        },
      })

      expect(linkConfig.user.toJSON()).toEqual({
        field: "user",
        entity: "User",
        linkable: "user_id",
        primaryKey: "id",
        serviceName: "myService",
      })
      expect(linkConfig.currency.toJSON()).toEqual({
        field: "currency",
        entity: "Currency",
        linkable: "currency_code",
        primaryKey: "code",
        serviceName: "myService",
      })
    })
  })

  describe("buildLinkConfigFromModelObjects", () => {
    it("should return a link config object based on the DML's primary keys", () => {
      const user = model.define("user", {
        id: model.id().primaryKey(),
        name: model.text(),
      })

      const car = model.define(
        { name: "car", tableName: "car" },
        {
          id: model.id(),
          number_plate: model.text().primaryKey(),
        }
      )

      const linkConfig = buildLinkConfigFromModelObjects("myService", {
        user,
        car,
      })

      expectTypeOf(linkConfig).toMatchTypeOf<{
        user: {
          id: {
            serviceName: "myService"
            field: "user"
            linkable: "user_id"
            primaryKey: "id"
          }
          toJSON: () => {
            serviceName: "myService"
            field: "user"
            linkable: "user_id"
            primaryKey: "id"
          }
        }
        car: {
          number_plate: {
            serviceName: "myService"
            field: "car"
            linkable: "car_number_plate"
            primaryKey: "number_plate"
          }
          toJSON: () => {
            serviceName: "myService"
            field: "car"
            linkable: "car_number_plate"
            primaryKey: "number_plate"
          }
        }
      }>()

      expect(linkConfig.user.id).toEqual({
        serviceName: "myService",
        field: "user",
        entity: "User",
        linkable: "user_id",
        primaryKey: "id",
      })
      expect(linkConfig.car.number_plate).toEqual({
        serviceName: "myService",
        field: "car",
        entity: "Car",
        linkable: "car_number_plate",
        primaryKey: "number_plate",
      })

      expect(linkConfig.car.toJSON()).toEqual({
        serviceName: "myService",
        field: "car",
        entity: "Car",
        linkable: "car_number_plate",
        primaryKey: "number_plate",
      })
      expect(linkConfig.user.toJSON()).toEqual({
        serviceName: "myService",
        field: "user",
        entity: "User",
        linkable: "user_id",
        primaryKey: "id",
      })
    })
  })
})
