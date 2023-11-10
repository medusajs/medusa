# AzureActiveDirectoryMsiAppServiceAuthentication

## Properties

### options

 **options**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `clientId?` | `string` | If you user want to connect to an Azure app service using a specific client account they need to provide `clientId` associate to their created identity. This is optional for retrieve token from azure web app service |
| `msiEndpoint?` | `string` | A msi app service environment need to provide `msiEndpoint` for retriving the accesstoken. |
| `msiSecret?` | `string` | A msi app service environment need to provide `msiSecret` for retrieved the accesstoken. |

#### Defined in

node_modules/typeorm/driver/sqlserver/authentication/AzureActiveDirectoryMsiAppServiceAuthentication.d.ts:3

___

### type

 **type**: ``"azure-active-directory-msi-app-service"``

#### Defined in

node_modules/typeorm/driver/sqlserver/authentication/AzureActiveDirectoryMsiAppServiceAuthentication.d.ts:2
