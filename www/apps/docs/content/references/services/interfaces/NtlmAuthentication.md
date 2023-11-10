# NtlmAuthentication

## Properties

### options

 **options**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `domain` | `string` | Once you set domain for ntlm authentication type, driver will connect to SQL Server using domain login. This is necessary for forming a connection using ntlm type |
| `password` | `string` | Password from your windows account. |
| `userName` | `string` | User name from your windows account. |

#### Defined in

node_modules/typeorm/driver/sqlserver/authentication/NtlmAuthentication.d.ts:3

___

### type

 **type**: ``"ntlm"``

#### Defined in

node_modules/typeorm/driver/sqlserver/authentication/NtlmAuthentication.d.ts:2
