---
displayed_sidebar: jsClientSidebar
---

# Interface: RetryConfig

[internal](../modules/internal.md).RetryConfig

Configuration for the Axios `request` method.

## Properties

### backoffType

• `Optional` **backoffType**: ``"linear"`` \| ``"static"`` \| ``"exponential"``

Backoff Type; 'linear', 'static' or 'exponential'.

#### Defined in

medusa-js/node_modules/retry-axios/dist/src/index.d.ts:47

___

### checkRetryAfter

• `Optional` **checkRetryAfter**: `boolean`

Whether to check for 'Retry-After' header in response and use value as delay. Defaults to true.

#### Defined in

medusa-js/node_modules/retry-axios/dist/src/index.d.ts:51

___

### currentRetryAttempt

• `Optional` **currentRetryAttempt**: `number`

The number of retries already attempted.

#### Defined in

medusa-js/node_modules/retry-axios/dist/src/index.d.ts:13

___

### httpMethodsToRetry

• `Optional` **httpMethodsToRetry**: `string`[]

The HTTP Methods that will be automatically retried.
Defaults to ['GET','PUT','HEAD','OPTIONS','DELETE']

#### Defined in

medusa-js/node_modules/retry-axios/dist/src/index.d.ts:26

___

### instance

• `Optional` **instance**: [`AxiosInstance`](internal.AxiosInstance.md)

The instance of the axios object to which the interceptor is attached.

#### Defined in

medusa-js/node_modules/retry-axios/dist/src/index.d.ts:21

___

### maxRetryAfter

• `Optional` **maxRetryAfter**: `number`

Max permitted Retry-After value (in ms) - rejects if greater. Defaults to 5 mins.

#### Defined in

medusa-js/node_modules/retry-axios/dist/src/index.d.ts:55

___

### maxRetryDelay

• `Optional` **maxRetryDelay**: `number`

Ceiling for calculated delay (in ms) - delay will not exceed this value.

#### Defined in

medusa-js/node_modules/retry-axios/dist/src/index.d.ts:59

___

### noResponseRetries

• `Optional` **noResponseRetries**: `number`

When there is no response, the number of retries to attempt. Defaults to 2.

#### Defined in

medusa-js/node_modules/retry-axios/dist/src/index.d.ts:43

___

### onRetryAttempt

• `Optional` **onRetryAttempt**: (`err`: [`AxiosError`](internal.AxiosError.md)<`any`, `any`\>) => `void`

#### Type declaration

▸ (`err`): `void`

Function to invoke when a retry attempt is made.

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`AxiosError`](internal.AxiosError.md)<`any`, `any`\> |

##### Returns

`void`

#### Defined in

medusa-js/node_modules/retry-axios/dist/src/index.d.ts:35

___

### retry

• `Optional` **retry**: `number`

The number of times to retry the request.  Defaults to 3.

#### Defined in

medusa-js/node_modules/retry-axios/dist/src/index.d.ts:9

___

### retryDelay

• `Optional` **retryDelay**: `number`

The amount of time to initially delay the retry.  Defaults to 100.

#### Defined in

medusa-js/node_modules/retry-axios/dist/src/index.d.ts:17

___

### shouldRetry

• `Optional` **shouldRetry**: (`err`: [`AxiosError`](internal.AxiosError.md)<`any`, `any`\>) => `boolean`

#### Type declaration

▸ (`err`): `boolean`

Function to invoke which determines if you should retry

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`AxiosError`](internal.AxiosError.md)<`any`, `any`\> |

##### Returns

`boolean`

#### Defined in

medusa-js/node_modules/retry-axios/dist/src/index.d.ts:39

___

### statusCodesToRetry

• `Optional` **statusCodesToRetry**: `number`[][]

The HTTP response status codes that will automatically be retried.
Defaults to: [[100, 199], [429, 429], [500, 599]]

#### Defined in

medusa-js/node_modules/retry-axios/dist/src/index.d.ts:31
