---
displayed_sidebar: jsClientSidebar
---

# Class: AdminGetRegionsRegionFulfillmentOptionsRes

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminGetRegionsRegionFulfillmentOptionsRes

**`Schema`**

AdminGetRegionsRegionFulfillmentOptionsRes
type: object
required:
  - fulfillment_options
properties:
  fulfillment_options:
    type: array
    description: Fulfillment providers details.
    items:
      type: object
      required:
        - provider_id
        - options
      properties:
        provider_id:
          description: ID of the fulfillment provider
          type: string
        options:
          description: fulfillment provider options
          type: array
          items:
            type: object
            example:
              - id: "manual-fulfillment"
              - id: "manual-fulfillment-return"
                is_return: true

## Properties

### fulfillment\_options

• **fulfillment\_options**: [`FulfillmentOption`](internal-8.internal.FulfillmentOption.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/regions/index.d.ts:121
