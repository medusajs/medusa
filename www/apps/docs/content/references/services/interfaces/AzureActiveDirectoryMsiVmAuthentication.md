# AzureActiveDirectoryMsiVmAuthentication

## Properties

### options

 **options**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `clientId?` | `string` | If you user want to connect to an Azure app service using a specific client account they need to provide `clientId` associate to their created identity. This is optional for retrieve token from azure web app service |
| `msiEndpoint?` | `string` | A user need to provide `msiEndpoint` for retrieving the accesstoken. |

#### Defined in

node_modules/typeorm/driver/sqlserver/authentication/AzureActiveDirectoryMsiVmAuthentication.d.ts:3

___

### type

 **type**: ``"azure-active-directory-msi-vm"``

#### Defined in

node_modules/typeorm/driver/sqlserver/authentication/AzureActiveDirectoryMsiVmAuthentication.d.ts:2
