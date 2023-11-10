# EventEmitterAsyncResourceOptions

[EventEmitter](../../modules/EventEmitter.md).EventEmitterAsyncResourceOptions

## Hierarchy

- [`AsyncResourceOptions`](../../interfaces/AsyncResourceOptions.md)

- [`EventEmitterOptions`](../../interfaces/EventEmitterOptions.md)

  ↳ **`EventEmitterAsyncResourceOptions`**

## Properties

### captureRejections

 `Optional` **captureRejections**: `boolean`

Enables automatic capturing of promise rejection.

#### Inherited from

[EventEmitterOptions](../../interfaces/EventEmitterOptions.md).[captureRejections](../../interfaces/EventEmitterOptions.md#capturerejections)

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:76

___

### name

 `Optional` **name**: `string`

The type of async event, this is required when instantiating `EventEmitterAsyncResource`
directly rather than as a child class.

**Default**

```ts
new.target.name if instantiated as a child class.
```

#### Defined in

docs-util/node_modules/@types/node/events.d.ts:469

___

### requireManualDestroy

 `Optional` **requireManualDestroy**: `boolean`

Disables automatic `emitDestroy` when the object is garbage collected.
This usually does not need to be set (even if `emitDestroy` is called
manually), unless the resource's `asyncId` is retrieved and the
sensitive API's `emitDestroy` is called with it.

**Default**

```ts
false
```

#### Inherited from

[AsyncResourceOptions](../../interfaces/AsyncResourceOptions.md).[requireManualDestroy](../../interfaces/AsyncResourceOptions.md#requiremanualdestroy)

#### Defined in

docs-util/node_modules/@types/node/async_hooks.d.ts:222

___

### triggerAsyncId

 `Optional` **triggerAsyncId**: `number`

The ID of the execution context that created this async event.

**Default**

```ts
executionAsyncId()
```

#### Inherited from

[AsyncResourceOptions](../../interfaces/AsyncResourceOptions.md).[triggerAsyncId](../../interfaces/AsyncResourceOptions.md#triggerasyncid)

#### Defined in

docs-util/node_modules/@types/node/async_hooks.d.ts:214
