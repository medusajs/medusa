# DetailedPeerCertificate

## Hierarchy

- [`PeerCertificate`](PeerCertificate.md)

  ↳ **`DetailedPeerCertificate`**

## Properties

### asn1Curve

 `Optional` **asn1Curve**: `string`

The ASN.1 name of the OID of the elliptic curve.
Well-known curves are identified by an OID.
While it is unusual, it is possible that the curve
is identified by its mathematical properties,
in which case it will not have an OID.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[asn1Curve](PeerCertificate.md#asn1curve)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:126

___

### bits

 `Optional` **bits**: `number`

For RSA keys: The RSA bit size.

For EC keys: The key size in bits.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[bits](PeerCertificate.md#bits)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:106

___

### ca

 **ca**: `boolean`

`true` if a Certificate Authority (CA), `false` otherwise.

**Since**

v18.13.0

#### Inherited from

[PeerCertificate](PeerCertificate.md).[ca](PeerCertificate.md#ca)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:48

___

### exponent

 `Optional` **exponent**: `string`

The RSA exponent, as a string in hexadecimal number notation.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[exponent](PeerCertificate.md#exponent)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:110

___

### ext\_key\_usage

 `Optional` **ext\_key\_usage**: `string`[]

The extended key usage, a set of OIDs.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[ext_key_usage](PeerCertificate.md#ext_key_usage)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:91

___

### fingerprint

 **fingerprint**: `string`

The SHA-1 digest of the DER encoded certificate.
It is returned as a `:` separated hexadecimal string.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[fingerprint](PeerCertificate.md#fingerprint)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:77

___

### fingerprint256

 **fingerprint256**: `string`

The SHA-256 digest of the DER encoded certificate.
It is returned as a `:` separated hexadecimal string.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[fingerprint256](PeerCertificate.md#fingerprint256)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:82

___

### fingerprint512

 **fingerprint512**: `string`

The SHA-512 digest of the DER encoded certificate.
It is returned as a `:` separated hexadecimal string.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[fingerprint512](PeerCertificate.md#fingerprint512)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:87

___

### infoAccess

 `Optional` **infoAccess**: [`Dict`](Dict.md)<`string`[]\>

An array describing the AuthorityInfoAccess, used with OCSP.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[infoAccess](PeerCertificate.md#infoaccess)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:100

___

### issuer

 **issuer**: [`Certificate`](Certificate.md)

The certificate issuer, described in the same terms as the `subject`.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[issuer](PeerCertificate.md#issuer)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:60

___

### issuerCertificate

 **issuerCertificate**: [`DetailedPeerCertificate`](DetailedPeerCertificate.md)

The issuer certificate object.
For self-signed certificates, this may be a circular reference.

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:138

___

### modulus

 `Optional` **modulus**: `string`

The RSA modulus, as a hexadecimal string.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[modulus](PeerCertificate.md#modulus)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:114

___

### nistCurve

 `Optional` **nistCurve**: `string`

The NIST name for the elliptic curve,if it has one
(not all well-known curves have been assigned names by NIST).

#### Inherited from

[PeerCertificate](PeerCertificate.md).[nistCurve](PeerCertificate.md#nistcurve)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:131

___

### pubkey

 `Optional` **pubkey**: [`Buffer`](../index.md#buffer)

The public key.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[pubkey](PeerCertificate.md#pubkey)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:118

___

### raw

 **raw**: [`Buffer`](../index.md#buffer)

The DER encoded X.509 certificate data.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[raw](PeerCertificate.md#raw)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:52

___

### serialNumber

 **serialNumber**: `string`

The certificate serial number, as a hex string.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[serialNumber](PeerCertificate.md#serialnumber)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:72

___

### subject

 **subject**: [`Certificate`](Certificate.md)

The certificate subject.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[subject](PeerCertificate.md#subject)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:56

___

### subjectaltname

 `Optional` **subjectaltname**: `string`

A string containing concatenated names for the subject,
an alternative to the `subject` names.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[subjectaltname](PeerCertificate.md#subjectaltname)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:96

___

### valid\_from

 **valid\_from**: `string`

The date-time the certificate is valid from.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[valid_from](PeerCertificate.md#valid_from)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:64

___

### valid\_to

 **valid\_to**: `string`

The date-time the certificate is valid to.

#### Inherited from

[PeerCertificate](PeerCertificate.md).[valid_to](PeerCertificate.md#valid_to)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:68
