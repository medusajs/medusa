# Admin

The **Admin** class is an internal class that allows convenient access to
the admin functionality and commands for MongoDB.

**ADMIN Cannot directly be instantiated**

**Example**

```ts
import { MongoClient } from "mongodb"

const client = new MongoClient("mongodb://localhost:27017")
const admin = client.db().admin()
const dbInfo = await admin.listDatabases()
for (const db of dbInfo.databases) {
  console.log(db.name)
}
```

## Constructors

### constructor

**new Admin**()

## Methods

### addUser

**addUser**(`username`, `passwordOrOptions?`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Add a user to the database

#### Parameters

| Name | Description |
| :------ | :------ |
| `username` | `string` | The username for the new user |
| `passwordOrOptions?` | `string` \| [`AddUserOptions`](../interfaces/AddUserOptions.md) | An optional password for the new user, or the options for the command |
| `options?` | [`AddUserOptions`](../interfaces/AddUserOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:263

___

### buildInfo

**buildInfo**(`options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Retrieve the server build information

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:237

___

### command

**command**(`command`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Execute a command

#### Parameters

| Name | Description |
| :------ | :------ |
| `command` | [`Document`](../interfaces/Document.md) | The command to execute |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:231

___

### listDatabases

**listDatabases**(`options?`): `Promise`<[`ListDatabasesResult`](../interfaces/ListDatabasesResult.md)\>

List the available databases

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`ListDatabasesOptions`](../interfaces/ListDatabasesOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`ListDatabasesResult`](../interfaces/ListDatabasesResult.md)\>

-`Promise`: 
	-`databases`: 
		-`empty`: (optional) 
		-`name`: 
		-`sizeOnDisk`: (optional) 
	-`ok`: 
	-`totalSize`: (optional) 
	-`totalSizeMb`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:283

___

### ping

**ping**(`options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Ping the MongoDB server and retrieve results

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:255

___

### removeUser

**removeUser**(`username`, `options?`): `Promise`<`boolean`\>

Remove a user from a database

#### Parameters

| Name | Description |
| :------ | :------ |
| `username` | `string` | The username to remove |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:270

___

### replSetGetStatus

**replSetGetStatus**(`options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Get ReplicaSet status

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:289

___

### serverInfo

**serverInfo**(`options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Retrieve the server build information

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:243

___

### serverStatus

**serverStatus**(`options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Retrieve this db's server status.

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:249

___

### validateCollection

**validateCollection**(`collectionName`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Validate an existing collection

#### Parameters

| Name | Description |
| :------ | :------ |
| `collectionName` | `string` | The name of the collection to validate. |
| `options?` | [`ValidateCollectionOptions`](../interfaces/ValidateCollectionOptions.md) | Optional settings for the command |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:277
