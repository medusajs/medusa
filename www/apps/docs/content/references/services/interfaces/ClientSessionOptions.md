# ClientSessionOptions

## Properties

### causalConsistency

 `Optional` **causalConsistency**: `boolean`

Whether causal consistency should be enabled on this session

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1407

___

### defaultTransactionOptions

 `Optional` **defaultTransactionOptions**: [`TransactionOptions`](TransactionOptions.md)

The default TransactionOptions to use for transactions started on this session.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1411

___

### snapshot

 `Optional` **snapshot**: `boolean`

Whether all read operations should be read from the same snapshot for this session (NOTE: not compatible with `causalConsistency=true`)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1409
