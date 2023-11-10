# AsyncResourceOptions

## Hierarchy

- **`AsyncResourceOptions`**

  ↳ [`EventEmitterAsyncResourceOptions`](../index.md#eventemitterasyncresourceoptions)

## Properties

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

#### Defined in

docs-util/node_modules/@types/node/async_hooks.d.ts:214
