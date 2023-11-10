# AutoEncryptionTlsOptions

## Properties

### tlsCAFile

 `Optional` **tlsCAFile**: `string`

Specifies the location of a local .pem file that contains the
root certificate chain from the Certificate Authority.
This file is used to validate the certificate presented by the
KMS provider.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:658

___

### tlsCertificateKeyFile

 `Optional` **tlsCertificateKeyFile**: `string`

Specifies the location of a local .pem file that contains
either the client's TLS/SSL certificate and key or only the
client's TLS/SSL key when tlsCertificateFile is used to
provide the certificate.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:647

___

### tlsCertificateKeyFilePassword

 `Optional` **tlsCertificateKeyFilePassword**: `string`

Specifies the password to de-crypt the tlsCertificateKeyFile.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:651
