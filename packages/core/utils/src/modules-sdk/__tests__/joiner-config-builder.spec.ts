import { defineJoinerConfig } from "../joiner-config-builder"
import { Modules } from "../definition"

const FulfillmentSet = {
  name: "FulfillmentSet",
}
const ShippingOption = {
  name: "ShippingOption",
}
const ShippingProfile = {
  name: "ShippingProfile",
}
const Fulfillment = {
  name: "Fulfillment",
}
const FulfillmentProvider = {
  name: "FulfillmentProvider",
}
const ServiceZone = {
  name: "ServiceZone",
}
const GeoZone = {
  name: "GeoZone",
}
const ShippingOptionRule = {
  name: "ShippingOptionRule",
}

describe("defineJoiner", () => {
  it("should return a full joiner configuration", () => {
    const joinerConfig = defineJoinerConfig(Modules.FULFILLMENT, {
      entityQueryingConfig: [
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
      entityQueryingConfig: [
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
      entityQueryingConfig: [FulfillmentSet],
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
