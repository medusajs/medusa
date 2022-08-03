# Class: NoteService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`NoteService`**

## Constructors

### constructor

• **new NoteService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/note.js:12](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/note.js#L12)

## Properties

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[services/note.js:6](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/note.js#L6)

## Methods

### create

▸ **create**(`data`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `CreateNoteInput` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/note.js:98](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/note.js#L98)

___

### delete

▸ **delete**(`noteId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `noteId` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/note.js:154](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/note.js#L154)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`Note`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` |  |
| `config` | `Object` |  |
| `config.relations` | `string`[] |  |
| `config.skip` | `number` |  |
| `config.take` | `number` |  |

#### Returns

`Promise`<`Note`[]\>

#### Defined in

[services/note.js:77](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/note.js#L77)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`Note`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`Note`\>

#### Defined in

[services/note.js:51](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/note.js#L51)

___

### update

▸ **update**(`noteId`, `value`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `noteId` | `any` |  |
| `value` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/note.js:131](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/note.js#L131)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`NoteService`](NoteService.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionManager` | `EntityManager` |  |

#### Returns

[`NoteService`](NoteService.md)

#### Defined in

[services/note.js:30](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/note.js#L30)
