<p align="center">
  <a href="https://www.medusajs.com">
    <img alt="Medusa" src="https://user-images.githubusercontent.com/7554214/153162406-bf8fd16f-aa98-4604-b87b-e13ab4baf604.png" width="100" />
  </a>
</p>
<h1 align="center">
  @medusajs/admin
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://demo.medusajs.com/">Medusa Admin Demo</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
An open source composable commerce engine built for developers.
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Medusa is released under the MIT license." />
  </a>
  <a href="https://circleci.com/gh/medusajs/medusa">
    <img src="https://circleci.com/gh/medusajs/medusa.svg?style=shield" alt="Current CircleCI build status." />
  </a>
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
    <a href="https://www.producthunt.com/posts/medusa"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Day-%23DA552E" alt="Product Hunt"></a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

## Getting started

Install the package:

```bash
yarn add @medusajs/admin
```

Add the plugin to your `medusa-config.js`:

```js
module.exports = {
  // ...
  plugins: [
    {
      resolve: "@medusajs/admin",
      options: {
        // ...
      },
    },
  ],
  // ...
}
```

## Configuration

The plugin can be configured with the following options:

| Option        | Type       | Description                                                                                                                                             | Default     |
| ------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `serve`       | `boolean?` | Whether to serve the admin dashboard or not.                                                                                                            | `true`      |
| `path`        | `string?`  | The path the admin server should run on. Should not be prefixed or suffixed with a slash. Cannot be one of the reserved paths: `"admin"` and `"store"`. | `"app"`     |
| `outDir`      | `string?`  | Optional path for where to output the admin build files                                                                                                 | `undefined` |
| `autoRebuild` | `boolean?` | Decides whether the admin UI should be rebuild if any changes or a missing build is detected during server startup                                      | `false`     |

**Hint**: You can import the PluginOptions type for inline documentation for the different options:

```js
module.exports = {
  // ...
  plugins: [
    {
      resolve: "@medusajs/admin",
      /** @type {import('@medusajs/admin').PluginOptions} */
      options: {
        path: "app",
      },
    },
  ],
  // ...
}
```

## Building the admin dashboard

The admin will be built automatically the first time you start your server if you have enabled `autoRebuild`. Any subsequent changes to the plugin options will result in a rebuild of the admin dashboard.

You may need to manually trigger a rebuild sometimes, for example after you have upgraded to a newer version of `@medusajs/admin`, or if you have disabled `autoRebuild`. You can do so by adding the following script to your `package.json`:

```json
{
  "scripts": {
    "build:admin": "medusa-admin build"
  }
}
```

## Accessing the admin dashboard

The admin dashboard will be available at `your-server-url/app`, unless you have specified a custom path in the plugin options. If you are running your server locally on port 9000 with the default path `"app"`, you will be able access the admin dashboard at `http://localhost:9000/app`.
