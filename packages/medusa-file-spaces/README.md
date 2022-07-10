# medusa-file-spaces

Upload files to a DigitalOcean Space.

Learn more about how you can use this plugin in the [documentaion](https://docs.medusajs.com/add-plugins/spaces).

## Options

```js
{
  spaces_url: "https://test.fra1.digitaloceanspaces.com",
  bucket: "test",
  endpoint: "fra1.digitaloceanspaces.com",
  access_key_id: "YOUR-ACCESS-KEY",
  secret_access_key: "YOUR-SECRET-KEY",
}
```

Optionally a `download_url_duration` option can be specified to change the valid duration of presigned download links. The duration is configured in seconds. (Default = 60 seconds)
