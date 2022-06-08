---
displayed_sidebar: jsClientSidebar
---

# Interface: Date

[internal](../modules/internal.md).Date

Enables basic storage and retrieval of dates and times.

## Methods

### [toPrimitive]

▸ **[toPrimitive]**(`hint`): `string`

Converts a Date object to a string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hint` | ``"default"`` |

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:114

▸ **[toPrimitive]**(`hint`): `string`

Converts a Date object to a string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hint` | ``"string"`` |

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:118

▸ **[toPrimitive]**(`hint`): `number`

Converts a Date object to a number.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hint` | ``"number"`` |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:122

▸ **[toPrimitive]**(`hint`): `string` \| `number`

Converts a Date object to a string or number.

**`throws`** {TypeError} If 'hint' was given something other than "number", "string", or "default".

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hint` | `string` | The strings "number", "string", or "default" to specify what primitive to return. |

#### Returns

`string` \| `number`

A number if 'hint' was "number", a string if 'hint' was "string" or "default".

#### Defined in

node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:131

___

### getDate

▸ **getDate**(): `number`

Gets the day-of-the-month, using local time.

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:775

___

### getDay

▸ **getDay**(): `number`

Gets the day of the week, using local time.

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:779

___

### getFullYear

▸ **getFullYear**(): `number`

Gets the year, using local time.

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:767

___

### getHours

▸ **getHours**(): `number`

Gets the hours in a date, using local time.

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:783

___

### getMilliseconds

▸ **getMilliseconds**(): `number`

Gets the milliseconds of a Date, using local time.

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:795

___

### getMinutes

▸ **getMinutes**(): `number`

Gets the minutes of a Date object, using local time.

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:787

___

### getMonth

▸ **getMonth**(): `number`

Gets the month, using local time.

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:771

___

### getSeconds

▸ **getSeconds**(): `number`

Gets the seconds of a Date object, using local time.

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:791

___

### getTime

▸ **getTime**(): `number`

Gets the time value in milliseconds.

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:765

___

### getTimezoneOffset

▸ **getTimezoneOffset**(): `number`

Gets the difference in minutes between the time on the local computer and Universal Coordinated Time (UTC).

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:799

___

### getUTCDate

▸ **getUTCDate**(): `number`

Gets the day-of-the-month, using Universal Coordinated Time (UTC).

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:777

___

### getUTCDay

▸ **getUTCDay**(): `number`

Gets the day of the week using Universal Coordinated Time (UTC).

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:781

___

### getUTCFullYear

▸ **getUTCFullYear**(): `number`

Gets the year using Universal Coordinated Time (UTC).

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:769

___

### getUTCHours

▸ **getUTCHours**(): `number`

Gets the hours value in a Date object using Universal Coordinated Time (UTC).

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:785

___

### getUTCMilliseconds

▸ **getUTCMilliseconds**(): `number`

Gets the milliseconds of a Date object using Universal Coordinated Time (UTC).

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:797

___

### getUTCMinutes

▸ **getUTCMinutes**(): `number`

Gets the minutes of a Date object using Universal Coordinated Time (UTC).

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:789

___

### getUTCMonth

▸ **getUTCMonth**(): `number`

Gets the month of a Date object using Universal Coordinated Time (UTC).

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:773

___

### getUTCSeconds

▸ **getUTCSeconds**(): `number`

Gets the seconds of a Date object using Universal Coordinated Time (UTC).

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:793

___

### setDate

▸ **setDate**(`date`): `number`

Sets the numeric day-of-the-month value of the Date object using local time.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `number` | A numeric value equal to the day of the month. |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:862

___

### setFullYear

▸ **setFullYear**(`year`, `month?`, `date?`): `number`

Sets the year of the Date object using local time.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `year` | `number` | A numeric value for the year. |
| `month?` | `number` | A zero-based numeric value for the month (0 for January, 11 for December). Must be specified if numDate is specified. |
| `date?` | `number` | A numeric value equal for the day of the month. |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:886

___

### setHours

▸ **setHours**(`hours`, `min?`, `sec?`, `ms?`): `number`

Sets the hour value in the Date object using local time.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hours` | `number` | A numeric value equal to the hours value. |
| `min?` | `number` | A numeric value equal to the minutes value. |
| `sec?` | `number` | A numeric value equal to the seconds value. |
| `ms?` | `number` | A numeric value equal to the milliseconds value. |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:849

___

### setMilliseconds

▸ **setMilliseconds**(`ms`): `number`

Sets the milliseconds value in the Date object using local time.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | A numeric value equal to the millisecond value. |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:809

___

### setMinutes

▸ **setMinutes**(`min`, `sec?`, `ms?`): `number`

Sets the minutes value in the Date object using local time.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `min` | `number` | A numeric value equal to the minutes value. |
| `sec?` | `number` | A numeric value equal to the seconds value. |
| `ms?` | `number` | A numeric value equal to the milliseconds value. |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:834

___

### setMonth

▸ **setMonth**(`month`, `date?`): `number`

Sets the month value in the Date object using local time.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `month` | `number` | A numeric value equal to the month. The value for January is 0, and other month values follow consecutively. |
| `date?` | `number` | A numeric value representing the day of the month. If this value is not supplied, the value from a call to the getDate method is used. |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:873

___

### setSeconds

▸ **setSeconds**(`sec`, `ms?`): `number`

Sets the seconds value in the Date object using local time.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sec` | `number` | A numeric value equal to the seconds value. |
| `ms?` | `number` | A numeric value equal to the milliseconds value. |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:821

___

### setTime

▸ **setTime**(`time`): `number`

Sets the date and time value in the Date object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `time` | `number` | A numeric value representing the number of elapsed milliseconds since midnight, January 1, 1970 GMT. |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:804

___

### setUTCDate

▸ **setUTCDate**(`date`): `number`

Sets the numeric day of the month in the Date object using Universal Coordinated Time (UTC).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `number` | A numeric value equal to the day of the month. |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:867

___

### setUTCFullYear

▸ **setUTCFullYear**(`year`, `month?`, `date?`): `number`

Sets the year value in the Date object using Universal Coordinated Time (UTC).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `year` | `number` | A numeric value equal to the year. |
| `month?` | `number` | A numeric value equal to the month. The value for January is 0, and other month values follow consecutively. Must be supplied if numDate is supplied. |
| `date?` | `number` | A numeric value equal to the day of the month. |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:893

___

### setUTCHours

▸ **setUTCHours**(`hours`, `min?`, `sec?`, `ms?`): `number`

Sets the hours value in the Date object using Universal Coordinated Time (UTC).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hours` | `number` | A numeric value equal to the hours value. |
| `min?` | `number` | A numeric value equal to the minutes value. |
| `sec?` | `number` | A numeric value equal to the seconds value. |
| `ms?` | `number` | A numeric value equal to the milliseconds value. |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:857

___

### setUTCMilliseconds

▸ **setUTCMilliseconds**(`ms`): `number`

Sets the milliseconds value in the Date object using Universal Coordinated Time (UTC).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | A numeric value equal to the millisecond value. |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:814

___

### setUTCMinutes

▸ **setUTCMinutes**(`min`, `sec?`, `ms?`): `number`

Sets the minutes value in the Date object using Universal Coordinated Time (UTC).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `min` | `number` | A numeric value equal to the minutes value. |
| `sec?` | `number` | A numeric value equal to the seconds value. |
| `ms?` | `number` | A numeric value equal to the milliseconds value. |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:841

___

### setUTCMonth

▸ **setUTCMonth**(`month`, `date?`): `number`

Sets the month value in the Date object using Universal Coordinated Time (UTC).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `month` | `number` | A numeric value equal to the month. The value for January is 0, and other month values follow consecutively. |
| `date?` | `number` | A numeric value representing the day of the month. If it is not supplied, the value from a call to the getUTCDate method is used. |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:879

___

### setUTCSeconds

▸ **setUTCSeconds**(`sec`, `ms?`): `number`

Sets the seconds value in the Date object using Universal Coordinated Time (UTC).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sec` | `number` | A numeric value equal to the seconds value. |
| `ms?` | `number` | A numeric value equal to the milliseconds value. |

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:827

___

### toDateString

▸ **toDateString**(): `string`

Returns a date as a string value.

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:753

___

### toISOString

▸ **toISOString**(): `string`

Returns a date as a string value in ISO format.

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:897

___

### toJSON

▸ **toJSON**(`key?`): `string`

Used by the JSON.stringify method to enable the transformation of an object's data for JavaScript Object Notation (JSON) serialization.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key?` | `any` |

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:899

___

### toLocaleDateString

▸ **toLocaleDateString**(): `string`

Returns a date as a string value appropriate to the host environment's current locale.

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:759

▸ **toLocaleDateString**(`locales?`, `options?`): `string`

Converts a date to a string by using the current or specified locale.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `locales?` | `string` \| `string`[] | A locale string or array of locale strings that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used. |
| `options?` | [`DateTimeFormatOptions`](internal.DateTimeFormatOptions.md) | An object that contains one or more properties that specify comparison options. |

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:4487

___

### toLocaleString

▸ **toLocaleString**(): `string`

Returns a value as a string value appropriate to the host environment's current locale.

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:757

▸ **toLocaleString**(`locales?`, `options?`): `string`

Converts a date and time to a string by using the current or specified locale.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `locales?` | `string` \| `string`[] | A locale string or array of locale strings that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used. |
| `options?` | [`DateTimeFormatOptions`](internal.DateTimeFormatOptions.md) | An object that contains one or more properties that specify comparison options. |

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:4481

___

### toLocaleTimeString

▸ **toLocaleTimeString**(): `string`

Returns a time as a string value appropriate to the host environment's current locale.

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:761

▸ **toLocaleTimeString**(`locales?`, `options?`): `string`

Converts a time to a string by using the current or specified locale.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `locales?` | `string` \| `string`[] | A locale string or array of locale strings that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used. |
| `options?` | [`DateTimeFormatOptions`](internal.DateTimeFormatOptions.md) | An object that contains one or more properties that specify comparison options. |

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:4494

___

### toString

▸ **toString**(): `string`

Returns a string representation of a date. The format of the string depends on the locale.

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:751

___

### toTimeString

▸ **toTimeString**(): `string`

Returns a time as a string value.

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:755

___

### toUTCString

▸ **toUTCString**(): `string`

Returns a date converted to a string using Universal Coordinated Time (UTC).

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:895

___

### valueOf

▸ **valueOf**(): `number`

Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.

#### Returns

`number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:763
