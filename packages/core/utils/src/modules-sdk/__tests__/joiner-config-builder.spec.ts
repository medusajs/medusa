import {
  buildLinkableKeysFromDmlObjects,
  buildLinkableKeysFromMikroOrmObjects,
  buildLinkConfigFromDmlObjects,
  defineJoinerConfig,
} from "../joiner-config-builder"
import { Modules } from "../definition"
import { model } from "../../dml"
import { expectTypeOf } from "expect-type"
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
        schema: undefined,
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
            args: {
              entity: FulfillmentSet.name,
              methodSuffix: "FulfillmentSets",
            },
          },
          {
            name: ["shipping_option", "shipping_options"],
            args: {
              entity: ShippingOption.name,
              methodSuffix: "ShippingOptions",
            },
          },
          {
            name: ["shipping_profile", "shipping_profiles"],
            args: {
              entity: ShippingProfile.name,
              methodSuffix: "ShippingProfiles",
            },
          },
          {
            name: ["fulfillment", "fulfillments"],
            args: {
              entity: Fulfillment.name,
              methodSuffix: "Fulfillments",
            },
          },
          {
            name: ["fulfillment_provider", "fulfillment_providers"],
            args: {
              entity: FulfillmentProvider.name,
              methodSuffix: "FulfillmentProviders",
            },
          },
          {
            name: ["service_zone", "service_zones"],
            args: {
              entity: ServiceZone.name,
              methodSuffix: "ServiceZones",
            },
          },
          {
            name: ["geo_zone", "geo_zones"],
            args: {
              entity: GeoZone.name,
              methodSuffix: "GeoZones",
            },
          },
          {
            name: ["shipping_option_rule", "shipping_option_rules"],
            args: {
              entity: ShippingOptionRule.name,
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
            args: {
              entity: "Custom",
              methodSuffix: "Customs",
            },
          },
        ],
      })

      expect(joinerConfig).toEqual({
        serviceName: Modules.FULFILLMENT,
        primaryKeys: ["id"],
        schema: undefined,
        linkableKeys: {},
        alias: [
          {
            name: ["custom", "customs"],
            args: {
              entity: "Custom",
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
            args: {
              entity: "Custom",
              methodSuffix: "Customs",
            },
          },
        ],
      })

      expect(joinerConfig).toEqual({
        serviceName: Modules.FULFILLMENT,
        primaryKeys: ["id"],
        schema: undefined,
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
            args: {
              entity: "Custom",
              methodSuffix: "Customs",
            },
          },
          {
            name: ["fulfillment_set", "fulfillment_sets"],
            args: {
              entity: FulfillmentSet.name,
              methodSuffix: "FulfillmentSets",
            },
          },
          {
            name: ["shipping_option", "shipping_options"],
            args: {
              entity: ShippingOption.name,
              methodSuffix: "ShippingOptions",
            },
          },
          {
            name: ["shipping_profile", "shipping_profiles"],
            args: {
              entity: ShippingProfile.name,
              methodSuffix: "ShippingProfiles",
            },
          },
          {
            name: ["fulfillment", "fulfillments"],
            args: {
              entity: Fulfillment.name,
              methodSuffix: "Fulfillments",
            },
          },
          {
            name: ["fulfillment_provider", "fulfillment_providers"],
            args: {
              entity: FulfillmentProvider.name,
              methodSuffix: "FulfillmentProviders",
            },
          },
          {
            name: ["service_zone", "service_zones"],
            args: {
              entity: ServiceZone.name,
              methodSuffix: "ServiceZones",
            },
          },
          {
            name: ["geo_zone", "geo_zones"],
            args: {
              entity: GeoZone.name,
              methodSuffix: "GeoZones",
            },
          },
          {
            name: ["shipping_option_rule", "shipping_option_rules"],
            args: {
              entity: ShippingOptionRule.name,
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
            args: {
              entity: "Custom",
            },
          },
        ],
      })

      expect(joinerConfig).toEqual({
        serviceName: Modules.FULFILLMENT,
        primaryKeys: ["id"],
        schema: undefined,
        linkableKeys: {},
        alias: [
          {
            name: ["custom", "customs"],
            args: {
              entity: "Custom",
              methodSuffix: "Customs",
            },
          },
        ],
      })
    })

    it("should return a full joiner configuration with custom aliases overriding defaults", () => {
      const joinerConfig = defineJoinerConfig(Modules.FULFILLMENT, {
        models: [FulfillmentSet],
        alias: [
          {
            name: ["fulfillment_set", "fulfillment_sets"],
            args: {
              entity: "FulfillmentSet",
              methodSuffix: "fulfillmentSetCustom",
            },
          },
        ],
      })

      expect(joinerConfig).toEqual({
        serviceName: Modules.FULFILLMENT,
        primaryKeys: ["id"],
        schema: undefined,
        linkableKeys: {
          fulfillment_set_id: FulfillmentSet.name,
        },
        alias: [
          {
            name: ["fulfillment_set", "fulfillment_sets"],
            args: {
              entity: "FulfillmentSet",
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
        schema: undefined,
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
            args: {
              entity: FulfillmentSet.name,
              methodSuffix: "FulfillmentSets",
            },
          },
          {
            name: ["shipping_option", "shipping_options"],
            args: {
              entity: ShippingOption.name,
              methodSuffix: "ShippingOptions",
            },
          },
          {
            name: ["shipping_profile", "shipping_profiles"],
            args: {
              entity: ShippingProfile.name,
              methodSuffix: "ShippingProfiles",
            },
          },
          {
            name: ["fulfillment", "fulfillments"],
            args: {
              entity: Fulfillment.name,
              methodSuffix: "Fulfillments",
            },
          },
          {
            name: ["fulfillment_provider", "fulfillment_providers"],
            args: {
              entity: FulfillmentProvider.name,
              methodSuffix: "FulfillmentProviders",
            },
          },
          {
            name: ["service_zone", "service_zones"],
            args: {
              entity: ServiceZone.name,
              methodSuffix: "ServiceZones",
            },
          },
          {
            name: ["geo_zone", "geo_zones"],
            args: {
              entity: GeoZone.name,
              methodSuffix: "GeoZones",
            },
          },
          {
            name: ["shipping_option_rule", "shipping_option_rules"],
            args: {
              entity: ShippingOptionRule.name,
              methodSuffix: "ShippingOptionRules",
            },
          },
        ],
      })
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
        user_id: user.name,
        car_number_plate: car.name,
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

  describe("buildLinkConfigFromDmlObjects", () => {
    it("should return a link config object based on the DML's primary keys", () => {
      const user = model.define("user", {
        id: model.id().primaryKey(),
        name: model.text(),
      })

      const car = model.define("car", {
        id: model.id(),
        number_plate: model.text().primaryKey(),
      })

      const linkConfig = buildLinkConfigFromDmlObjects([user, car])

      expectTypeOf(linkConfig).toMatchTypeOf<{
        user: {
          id: {
            linkable: "user_id"
            primaryKey: "id"
          }
          toJSON: () => {
            linkable: string
            primaryKey: string
          }
        }
        car: {
          number_plate: {
            linkable: "car_number_plate"
            primaryKey: "number_plate"
          }
          toJSON: () => {
            linkable: string
            primaryKey: string
          }
        }
      }>()

      expect(linkConfig.user.id).toEqual({
        linkable: "user_id",
        primaryKey: "id",
      })
      expect(linkConfig.car.number_plate).toEqual({
        linkable: "car_number_plate",
        primaryKey: "number_plate",
      })

      expect(linkConfig.car.toJSON()).toEqual({
        linkable: "car_number_plate",
        primaryKey: "number_plate",
      })
      expect(linkConfig.user.toJSON()).toEqual({
        linkable: "user_id",
        primaryKey: "id",
      })
    })
  })
})
