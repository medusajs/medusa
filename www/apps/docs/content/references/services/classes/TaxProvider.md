# TaxProvider

A tax provider represents a tax service installed in the Medusa backend, either through a plugin or backend customizations. It holds the tax service's installation status.

## Constructors

### constructor

**new TaxProvider**()

A tax provider represents a tax service installed in the Medusa backend, either through a plugin or backend customizations. It holds the tax service's installation status.

## Properties

### id

 **id**: `string`

The ID of the tax provider as given by the tax service.

#### Defined in

[packages/medusa/src/models/tax-provider.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/tax-provider.ts#L6)

___

### is\_installed

 **is\_installed**: `boolean` = `true`

Whether the tax service is installed in the current version. If a tax service is no longer installed, the `is_installed` attribute is set to `false`.

#### Defined in

[packages/medusa/src/models/tax-provider.ts:9](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/tax-provider.ts#L9)
