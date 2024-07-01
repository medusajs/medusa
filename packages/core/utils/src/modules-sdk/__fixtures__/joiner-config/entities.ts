import { model } from "../../../dml"

export const FulfillmentSet = {
  name: "FulfillmentSet",
}
export const ShippingOption = {
  name: "ShippingOption",
}
export const ShippingProfile = {
  name: "ShippingProfile",
}
export const Fulfillment = {
  name: "Fulfillment",
}
export const FulfillmentProvider = {
  name: "FulfillmentProvider",
}
export const ServiceZone = {
  name: "ServiceZone",
}
export const GeoZone = {
  name: "GeoZone",
}
export const ShippingOptionRule = {
  name: "ShippingOptionRule",
}

export const dmlFulfillmentSet = model.define(FulfillmentSet.name, {
  id: model.id(),
})
export const dmlShippingOption = model.define(ShippingOption.name, {
  id: model.id(),
})
export const dmlShippingProfile = model.define(ShippingProfile.name, {
  id: model.id(),
})
export const dmlFulfillment = model.define(Fulfillment.name, {
  id: model.id(),
})
export const dmlFulfillmentProvider = model.define(FulfillmentProvider.name, {
  id: model.id(),
})
export const dmlServiceZone = model.define(ServiceZone.name, {
  id: model.id(),
})

export const dmlGeoZone = model.define(GeoZone.name, {
  id: model.id(),
})

export const dmlShippingOptionRule = model.define(ShippingOptionRule.name, {
  id: model.id(),
})
