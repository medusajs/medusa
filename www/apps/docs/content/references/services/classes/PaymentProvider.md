# PaymentProvider

A payment provider represents a payment service installed in the Medusa backend, either through a plugin or backend customizations. It holds the payment service's installation status.

## Constructors

### constructor

**new PaymentProvider**()

A payment provider represents a payment service installed in the Medusa backend, either through a plugin or backend customizations. It holds the payment service's installation status.

## Properties

### id

 **id**: `string`

The ID of the payment provider as given by the payment service.

#### Defined in

[packages/medusa/src/models/payment-provider.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-provider.ts#L6)

___

### is\_installed

 **is\_installed**: `boolean` = `true`

Whether the payment service is installed in the current version. If a payment service is no longer installed, the `is_installed` attribute is set to `false`.

#### Defined in

[packages/medusa/src/models/payment-provider.ts:9](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-provider.ts#L9)
