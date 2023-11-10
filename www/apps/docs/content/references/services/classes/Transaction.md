# Transaction

A class maintaining state related to a server transaction. Internal Only

## Constructors

### constructor

**new Transaction**()

## Properties

### options

 **options**: [`TransactionOptions`](../interfaces/TransactionOptions.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5055

## Accessors

### isActive

`get` **isActive**(): `boolean`

#### Returns

`boolean`

-`boolean`: (optional) Whether this session is presently in a transaction

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5063

___

### isCommitted

`get` **isCommitted**(): `boolean`

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5064

___

### isPinned

`get` **isPinned**(): `boolean`

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5057

___

### isStarting

`get` **isStarting**(): `boolean`

#### Returns

`boolean`

-`boolean`: (optional) Whether the transaction has started

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5059

___

### recoveryToken

`get` **recoveryToken**(): `undefined` \| [`Document`](../interfaces/Document.md)

#### Returns

`undefined` \| [`Document`](../interfaces/Document.md)

-`undefined \| Document`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5056
