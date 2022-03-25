# Uploading images to MinIO

In order to work with images in Medusa, you need a file service plugin responsible for hosting. Following this guide will allow you to upload images to MinIO bucket.

### Before you start

At this point, you should have an instance of our store engine running. If not, we have a [full guide](https://docs.medusajs.com/tutorial/set-up-your-development-environment) for setting up your local environment.

### Set up MinIO

#### Create an MinIO bucket

In the MinIO console create a new bucket, then click into that bucket and change the `Access Policy` to `public`.

Be aware, that this will allow for anyone to acces your bucket. Avoid storing sensitive data.

#### Generate access keys

Navigate to users and perform the following steps:

- Enter new `Access Key` and `Secret Key`
- Select readwrite policy
- Submit the details

### Installation

First, install the plugin using your preferred package manager:

```
yarn add medusa-file-minio
```

Then configure your `medusa-config.js` to include the plugin alongside the required options:

```=javascript
{
    resolve: `medusa-file-minio`,
    options: {
        endpoint: "minio.server.com",
        bucket: "test",
        access_key_id: "YOUR-ACCESS-KEY",
        secret_access_key: "YOUR-SECRET-KEY",
    },
},
```

The two access keys in the options are the ones created in the previous section.

> Make sure to use an environment variable for the secret key in a live environment.

### Try it out

Finally, run your Medusa server alongside our admin system to try out your new file service. Upon editing or creating products, you can now upload thumbnails and images, that are stored in an MinIO server.
