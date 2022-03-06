# Spaces

In order to work with images in Medusa, you need a file service plugin responsible for hosting. Following this guide will allow you to upload images to DigitalOcean Spaces.

<div>
  <video width="100%" height="100%" playsinline autoplay muted controls>
    <source src="https://user-images.githubusercontent.com/59018053/154808767-7c030254-1879-41fd-a71c-b31c5508d8a4.mp4" type="video/mp4" />
  </video>
</div>

### Before you start

At this point, you should have an instance of our store engine running. If not, we have a [full guide](https://docs.medusa-commerce.com/tutorial/set-up-your-development-environment) for setting up your local environment.

### Set up DigitalOcean

#### Create a Space

Create an account on DigitalOcean and navigate to Spaces. Create a new Space with the default settings.

#### Generate access keys

Navigate to API in the left sidebar. Generate a new Spaces access key. This should provide you with an access key id and a secret key. Note them both down.

### Installation

First, install the plugin using your preferred package manager:

```
yarn add medusa-file-spaces
```

Then configure your `medusa-config.js` to include the plugin alongside the required options:

```=javascript
{
    resolve: `medusa-file-spaces`,
    options: {
        spaces_url: "https://test.fra1.digitaloceanspaces.com",
        bucket: "test",
        endpoint: "fra1.digitaloceanspaces.com",
        access_key_id: "YOUR-ACCESS-KEY",
        secret_access_key: "YOUR-SECRET-KEY",
    },
},
```

In the above options, a `spaces_url` is included. This can be found in your Space overview. The `bucket` should point to the name you gave your Space. The `endpoint` identifies the region in which you created the Space. And finally the two keys are the ones created in the previous section.

> Make sure to use an environment variable for the secret key in a live environment.

### Try it out!

Finally, run your Medusa server alongside our admin system to try out your new file service. Upon editing or creating products, you can now upload thumbnails and images, that are stored in DigitalOcean Spaces.
