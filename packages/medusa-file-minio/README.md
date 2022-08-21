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

  // private bucket configuration
  private_bucket: 'private-bucket',
  private_access_key_id: "YOUR-ACCESS-KEY",
  private_secret_access_key: "YOUR-SECRET-KEY",
}
```

Optionally a `download_url_duration` option can be specified to change the valid duration of presigned download links. The duration is configured in seconds. (Default = 60 seconds)

## Configuring a private bucket in Minio

Certain operations in Medusa such as data import and export require a separate, protected bucket. The plugin will raise an error if operations used for imports and exports are invoked without the correct setup.

Configuring Minio for requires configuration of one additional option: `private_bucket` which refers to the name given to the protected bucket in Minio.

Separate credentials can, optionally, be used to access the private bucket by configuring the following options:

```
  private_access_key_id: "YOUR-ACCESS-KEY",
  private_secret_access_key: "YOUR-SECRET-KEY",
```

If no separate access key is given the same access key will be used for both the `bucket` and the `private_bucket`.
