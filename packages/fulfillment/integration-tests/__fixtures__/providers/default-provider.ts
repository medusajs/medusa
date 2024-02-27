import { AbstractFulfillmentProviderService } from "@medusajs/utils/src"

export class FulfillmentProviderServiceFixtures extends AbstractFulfillmentProviderService {
  static identifier = "fixtures-fulfillment-provider"
}

export const services = [FulfillmentProviderServiceFixtures]
