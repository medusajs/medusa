# FulfillmentProvider

A fulfillment provider represents a fulfillment service installed in the Medusa backend, either through a plugin or backend customizations. It holds the fulfillment service's installation status.

## Constructors

### constructor

**new FulfillmentProvider**()

A fulfillment provider represents a fulfillment service installed in the Medusa backend, either through a plugin or backend customizations. It holds the fulfillment service's installation status.

## Properties

### id

 **id**: `string`

The ID of the fulfillment provider as given by the fulfillment service.

#### Defined in

[packages/medusa/src/models/fulfillment-provider.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/fulfillment-provider.ts#L6)

___

### is\_installed

 **is\_installed**: `boolean` = `true`

Whether the fulfillment service is installed in the current version. If a fulfillment service is no longer installed, the `is_installed` attribute is set to `false`.

#### Defined in

[packages/medusa/src/models/fulfillment-provider.ts:9](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/fulfillment-provider.ts#L9)
