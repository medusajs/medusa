import { cacheServiceMock } from "../__mocks__/cache";
import TaxProviderService from "../tax-provider";
import { EventBusServiceMock } from "../__mocks__/event-bus";
import { asClass, asValue, createContainer } from "awilix";
import { MockManager, MockRepository } from "medusa-test-utils"

export function getCacheKey(id, regionId) {
  return `txrtcache:${id}:${regionId}`
}

export const defaultContainer = createContainer()
defaultContainer.register("manager", asValue(MockManager))
defaultContainer.register("taxRateService", asValue({}))
defaultContainer.register("systemTaxService", asValue("system"))
defaultContainer.register("tp_test", asValue("good"))
defaultContainer.register("cacheService", asValue(cacheServiceMock))
defaultContainer.register("taxProviderService", asClass(TaxProviderService))
defaultContainer.register("taxProviderRepository", asValue(MockRepository))
defaultContainer.register("lineItemTaxLineRepository", asValue(MockRepository({ create: (d) => d })))
defaultContainer.register("shippingMethodTaxLineRepository", asValue(MockRepository))
defaultContainer.register("eventBusService", asValue(EventBusServiceMock))

export const getTaxLineFactory = ({ items, region }) => {
  const cart = {
    shipping_methods: [],
    items: items.map((i) => {
      return {
        id: i.id,
        variant: {
          product_id: i.product_id,
        },
      }
    }),
  }

  const calculationContext = {
    region,
    customer: {},
    allocation_map: {},
    shipping_address: {},
    shipping_methods: [],
  }

  return { cart, calculationContext }
}
