# BroadcasterResult

Broadcaster execution result - promises executed by operations and number of executed listeners and subscribers.

## Constructors

### constructor

**new BroadcasterResult**()

## Properties

### count

 **count**: `number`

Number of executed listeners and subscribers.

#### Defined in

node_modules/typeorm/subscriber/BroadcasterResult.d.ts:8

___

### promises

 **promises**: `Promise`<`any`\>[]

Promises returned by listeners and subscribers which needs to be awaited.

#### Defined in

node_modules/typeorm/subscriber/BroadcasterResult.d.ts:12

## Methods

### wait

**wait**(): `Promise`<[`BroadcasterResult`](BroadcasterResult.md)\>

Wait for all promises to settle

#### Returns

`Promise`<[`BroadcasterResult`](BroadcasterResult.md)\>

-`Promise`: 
	-`BroadcasterResult`: 

#### Defined in

node_modules/typeorm/subscriber/BroadcasterResult.d.ts:16
