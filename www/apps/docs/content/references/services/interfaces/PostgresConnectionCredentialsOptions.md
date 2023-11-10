# PostgresConnectionCredentialsOptions

Postgres specific connection credential options.

## Hierarchy

- **`PostgresConnectionCredentialsOptions`**

  ↳ [`PostgresConnectionOptions`](PostgresConnectionOptions.md)

## Properties

### database

 `Optional` `Readonly` **database**: `string`

Database name to connect to.

#### Defined in

node_modules/typeorm/driver/postgres/PostgresConnectionCredentialsOptions.d.ts:30

___

### host

 `Optional` `Readonly` **host**: `string`

Database host.

#### Defined in

node_modules/typeorm/driver/postgres/PostgresConnectionCredentialsOptions.d.ts:14

___

### password

 `Optional` `Readonly` **password**: `string` \| () => `string` \| () => `Promise`<`string`\>

Database password.

#### Defined in

node_modules/typeorm/driver/postgres/PostgresConnectionCredentialsOptions.d.ts:26

___

### port

 `Optional` `Readonly` **port**: `number`

Database host port.

#### Defined in

node_modules/typeorm/driver/postgres/PostgresConnectionCredentialsOptions.d.ts:18

___

### ssl

 `Optional` `Readonly` **ssl**: `boolean` \| [`TlsOptions`](TlsOptions.md)

Object with ssl parameters

#### Defined in

node_modules/typeorm/driver/postgres/PostgresConnectionCredentialsOptions.d.ts:34

___

### url

 `Optional` `Readonly` **url**: `string`

Connection url where perform connection to.

#### Defined in

node_modules/typeorm/driver/postgres/PostgresConnectionCredentialsOptions.d.ts:10

___

### username

 `Optional` `Readonly` **username**: `string`

Database username.

#### Defined in

node_modules/typeorm/driver/postgres/PostgresConnectionCredentialsOptions.d.ts:22
