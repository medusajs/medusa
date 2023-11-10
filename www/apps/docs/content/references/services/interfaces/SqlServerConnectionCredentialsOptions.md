# SqlServerConnectionCredentialsOptions

SqlServer specific connection credential options.

## Hierarchy

- **`SqlServerConnectionCredentialsOptions`**

  ↳ [`SqlServerConnectionOptions`](SqlServerConnectionOptions.md)

## Properties

### authentication

 `Optional` `Readonly` **authentication**: [`SqlServerConnectionCredentialsAuthenticationOptions`](../index.md#sqlserverconnectioncredentialsauthenticationoptions)

Authentication settings
It overrides username and password, when passed.

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions.d.ts:41

___

### database

 `Optional` `Readonly` **database**: `string`

Database name to connect to.

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions.d.ts:28

___

### domain

 `Optional` `Readonly` **domain**: `string`

Once you set domain, driver will connect to SQL Server using domain login.

**See**

 - SqlServerConnectionCredentialsOptions.authentication
 - NtlmAuthentication

**Deprecated**

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions.d.ts:48

___

### host

 `Optional` `Readonly` **host**: `string`

Database host.

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions.d.ts:20

___

### password

 `Optional` `Readonly` **password**: `string`

Database password.

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions.d.ts:36

___

### port

 `Optional` `Readonly` **port**: `number`

Database host port.

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions.d.ts:24

___

### url

 `Optional` `Readonly` **url**: `string`

Connection url where perform connection to.

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions.d.ts:16

___

### username

 `Optional` `Readonly` **username**: `string`

Database username.

#### Defined in

node_modules/typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions.d.ts:32
