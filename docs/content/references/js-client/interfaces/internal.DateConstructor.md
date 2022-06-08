---
displayed_sidebar: jsClientSidebar
---

# Interface: DateConstructor

[internal](../modules/internal.md).DateConstructor

## Callable

### DateConstructor

▸ **DateConstructor**(): `string`

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:906

## Properties

### prototype

• `Readonly` **prototype**: [`Date`](../modules/internal.md#date)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:907

## Methods

### UTC

▸ **UTC**(`year`, `month`, `date?`, `hours?`, `minutes?`, `seconds?`, `ms?`): `number`

Returns the number of milliseconds between midnight, January 1, 1970 Universal Coordinated Time (UTC) (or GMT) and the specified date.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `year` | `number` | The full year designation is required for cross-century date accuracy. If year is between 0 and 99 is used, then year is assumed to be 1900 + year. |
| `month` | `number` | The month as a number between 0 and 11 (January to December). |
| `date?` | `number` | The date as a number between 1 and 31. |
| `hours?` | `number` | Must be supplied if minutes is supplied. A number from 0 to 23 (midnight to 11pm) that specifies the hour. |
| `minutes?` | `number` | Must be supplied if seconds is supplied. A number from 0 to 59 that specifies the minutes. |
| `seconds?` | `number` | Must be supplied if milliseconds is supplied. A number from 0 to 59 that specifies the seconds. |
| `ms?` | `number` | A number from 0 to 999 that specifies the milliseconds. |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:923

___

### now

▸ **now**(): `number`

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:924

___

### parse

▸ **parse**(`s`): `number`

Parses a string containing a date, and returns the number of milliseconds between that date and midnight, January 1, 1970.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `s` | `string` | A date string |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:912
