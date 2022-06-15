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

[services/note.js:12](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/note.js#L12)

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

[services/note.js:6](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/note.js#L6)

## Methods

### create

▸ **create**(`data`, `config?`): `Promise`<`any`\>

Creates a note associated with a given author

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `CreateNoteInput` | the note to create |
| `config` | `any` | any configurations if needed, including meta data |

#### Returns

`Promise`<`any`\>

resolves to the creation result

#### Defined in

[services/note.js:98](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/note.js#L98)

___

### delete

▸ **delete**(`noteId`): `Promise`<`any`\>

Deletes a given note

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `noteId` | `any` | id of the note to delete |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/note.js:154](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/note.js#L154)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`Note`[]\>

Fetches all notes related to the given selector

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the query object for find |
| `config` | `Object` | the configuration used to find the objects. contains relations, skip, and take. |
| `config.relations` | `string`[] | Which relations to include in the resulting list of Notes. |
| `config.skip` | `number` | How many Notes to skip in the resulting list of Notes. |
| `config.take` | `number` | How many Notes to take in the resulting list of Notes. |

#### Returns

`Promise`<`Note`[]\>

notes related to the given search.

#### Defined in

[services/note.js:77](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/note.js#L77)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`Note`\>

Retrieves a specific note.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the note to retrieve. |
| `config` | `any` | any options needed to query for the result. |

#### Returns

`Promise`<`Note`\>

which resolves to the requested note.

#### Defined in

[services/note.js:51](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/note.js#L51)

___

### update

▸ **update**(`noteId`, `value`): `Promise`<`any`\>

Updates a given note with a new value

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `noteId` | `any` | the id of the note to update |
| `value` | `any` | the new value |

#### Returns

`Promise`<`any`\>

resolves to the updated element

#### Defined in

[services/note.js:131](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/note.js#L131)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`NoteService`](NoteService.md)

Sets the service's manager to a given transaction manager

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionManager` | `EntityManager` | the manager to use |

#### Returns

[`NoteService`](NoteService.md)

a cloned note service

#### Defined in

[services/note.js:30](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/note.js#L30)
