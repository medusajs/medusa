# medusa-file-minio

Upload files to a MinIO server.

Learn more about how you can use this plugin in the [documentation](https://docs.medusajs.com/add-plugins/minio).

## Options

```js
{
  endpoint: "minio.server.com",
  bucket: "test",
  access_key_id: "YOUR-ACCESS-KEY",
  secret_access_key: "YOUR-SECRET-KEY",
  private_bucket: 'private-bucket',
  private_access_key_id: "YOUR-ACCESS-KEY",
  private_secret_access_key: "YOUR-SECRET-KEY",
}
```

## Configuring Minio for exports and imports

Exporting and importing with minio requires setting up a protected bucket and the plugin will raise an error if operations used for imports and exports invoked without the correct setup.

Configuring Minio for import/export requires configuration of one additional option: `private_bucket` which refers to the name given to the protected bucket in Minio.

Separate credentials can be used with the private bucket by configuring the following options:

```
  private_access_key_id: "YOUR-ACCESS-KEY",
  private_secret_access_key: "YOUR-SECRET-KEY",
```

If no separate access key is given the same access key will be used for both the `bucket` and the `private_bucket`.
