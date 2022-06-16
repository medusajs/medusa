# Class: TaxRateService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`TaxRateService`**

## Constructors

### constructor

• **new TaxRateService**(`__namedParameters`)

#### Parameters

| Name                | Type     |
| :------------------ | :------- |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/tax-rate.ts:27](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L27)

## Properties

### manager\_

• `Private` **manager\_**: `EntityManager`

#### Defined in

[services/tax-rate.ts:21](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L21)

---

### productService\_

• `Private` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[services/tax-rate.ts:22](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L22)

---

### productTypeService\_

• `Private` **productTypeService\_**: [`ProductTypeService`](ProductTypeService.md)

#### Defined in

[services/tax-rate.ts:23](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L23)

---

### shippingOptionService\_

• `Private` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[services/tax-rate.ts:24](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L24)

---

### taxRateRepository\_

• `Private` **taxRateRepository\_**: typeof `TaxRateRepository`

#### Defined in

[services/tax-rate.ts:25](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L25)

## Methods

### addToProduct

▸ **addToProduct**(`id`, `productIds`, `replace?`): `Promise`<`ProductTaxRate` \| `ProductTaxRate`[]\>

#### Parameters

| Name         | Type                   | Default value |
| :----------- | :--------------------- | :------------ |
| `id`         | `string`               | `undefined`   |
| `productIds` | `string` \| `string`[] | `undefined`   |
| `replace`    | `boolean`              | `false`       |

#### Returns

`Promise`<`ProductTaxRate` \| `ProductTaxRate`[]\>

#### Defined in

[services/tax-rate.ts:197](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L197)

---

### addToProductType

▸ **addToProductType**(`id`, `productTypeIds`, `replace?`): `Promise`<`ProductTypeTaxRate`[]\>

#### Parameters

| Name             | Type                   | Default value |
| :--------------- | :--------------------- | :------------ |
| `id`             | `string`               | `undefined`   |
| `productTypeIds` | `string` \| `string`[] | `undefined`   |
| `replace`        | `boolean`              | `false`       |

#### Returns

`Promise`<`ProductTypeTaxRate`[]\>

#### Defined in

[services/tax-rate.ts:233](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L233)

---

### addToShippingOption

▸ **addToShippingOption**(`id`, `optionIds`, `replace?`): `Promise`<`ShippingTaxRate`\>

#### Parameters

| Name        | Type                   | Default value |
| :---------- | :--------------------- | :------------ |
| `id`        | `string`               | `undefined`   |
| `optionIds` | `string` \| `string`[] | `undefined`   |
| `replace`   | `boolean`              | `false`       |

#### Returns

`Promise`<`ShippingTaxRate`\>

#### Defined in

[services/tax-rate.ts:273](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L273)

---

### create

▸ **create**(`data`): `Promise`<`TaxRate`\>

#### Parameters

| Name   | Type                 |
| :----- | :------------------- |
| `data` | `CreateTaxRateInput` |

#### Returns

`Promise`<`TaxRate`\>

#### Defined in

[services/tax-rate.ts:104](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L104)

---

### delete

▸ **delete**(`id`): `Promise`<`void`\>

#### Parameters

| Name | Type                   |
| :--- | :--------------------- |
| `id` | `string` \| `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/tax-rate.ts:135](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L135)

---

### list

▸ **list**(`selector`, `config?`): `Promise`<`TaxRate`[]\>

#### Parameters

| Name       | Type                     |
| :--------- | :----------------------- |
| `selector` | `FilterableTaxRateProps` |
| `config`   | `FindConfig`<`TaxRate`\> |

#### Returns

`Promise`<`TaxRate`[]\>

#### Defined in

[services/tax-rate.ts:62](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L62)

---

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`TaxRate`[], `number`]\>

#### Parameters

| Name       | Type                     |
| :--------- | :----------------------- |
| `selector` | `FilterableTaxRateProps` |
| `config`   | `FindConfig`<`TaxRate`\> |

#### Returns

`Promise`<[`TaxRate`[], `number`]\>

#### Defined in

[services/tax-rate.ts:73](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L73)

---

### listByProduct

▸ **listByProduct**(`productId`, `config`): `Promise`<`TaxRate`[]\>

#### Parameters

| Name        | Type                  |
| :---------- | :-------------------- |
| `productId` | `string`              |
| `config`    | `TaxRateListByConfig` |

#### Returns

`Promise`<`TaxRate`[]\>

#### Defined in

[services/tax-rate.ts:321](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L321)

---

### listByShippingOption

▸ **listByShippingOption**(`shippingOptionId`, `config`): `Promise`<`TaxRate`[]\>

#### Parameters

| Name               | Type                  |
| :----------------- | :-------------------- |
| `shippingOptionId` | `string`              |
| `config`           | `TaxRateListByConfig` |

#### Returns

`Promise`<`TaxRate`[]\>

#### Defined in

[services/tax-rate.ts:332](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L332)

---

### removeFromProduct

▸ **removeFromProduct**(`id`, `productIds`): `Promise`<`void`\>

#### Parameters

| Name         | Type                   |
| :----------- | :--------------------- |
| `id`         | `string`               |
| `productIds` | `string` \| `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/tax-rate.ts:143](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L143)

---

### removeFromProductType

▸ **removeFromProductType**(`id`, `typeIds`): `Promise`<`void`\>

#### Parameters

| Name      | Type                   |
| :-------- | :--------------------- |
| `id`      | `string`               |
| `typeIds` | `string` \| `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/tax-rate.ts:161](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L161)

---

### removeFromShippingOption

▸ **removeFromShippingOption**(`id`, `optionIds`): `Promise`<`void`\>

#### Parameters

| Name        | Type                   |
| :---------- | :--------------------- |
| `id`        | `string`               |
| `optionIds` | `string` \| `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/tax-rate.ts:179](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L179)

---

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`TaxRate`\>

#### Parameters

| Name     | Type                     |
| :------- | :----------------------- |
| `id`     | `string`                 |
| `config` | `FindConfig`<`TaxRate`\> |

#### Returns

`Promise`<`TaxRate`\>

#### Defined in

[services/tax-rate.ts:84](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L84)

---

### update

▸ **update**(`id`, `data`): `Promise`<`TaxRate`\>

#### Parameters

| Name   | Type                 |
| :----- | :------------------- |
| `id`   | `string`             |
| `data` | `UpdateTaxRateInput` |

#### Returns

`Promise`<`TaxRate`\>

#### Defined in

[services/tax-rate.ts:120](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L120)

---

### withTransaction

▸ **withTransaction**(`transactionManager`): [`TaxRateService`](TaxRateService.md)

#### Parameters

| Name                 | Type            |
| :------------------- | :-------------- |
| `transactionManager` | `EntityManager` |

#### Returns

[`TaxRateService`](TaxRateService.md)

#### Defined in

[services/tax-rate.ts:43](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-rate.ts#L43)
