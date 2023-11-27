---
description: "In this document, you'll learn about the different ways you can configure the admin dashboard for your custom use cases."
---

# Admin Custom Configuration

In this document, you'll learn about the different ways you can configure the admin dashboard for your custom use cases.

## Admin CLI

### Build Command Options

The `build` command in the admin CLI allows you to manually build the admin dashboard. If you intend to use it, you should typically add it to the `package.json` of the Medusa backend:

```json title="package.json"
{
  "scripts": {
    // other scripts...
    "build:admin": "medusa-admin build"
  }
}
```

You can add the following option to the `medusa-admin build` command:

- `--deployment`: a boolean value indicating that the build should be ready for deployment. When this option is added, options are not loaded from `medusa-config.js` anymore, and it means the admin will be built to be hosted on an external host. This also means that the backend URL is loaded from the `MEDUSA_ADMIN_BACKEND_URL` environment variable. For example, `medusa-admin build --deployment`.

### Dev Command Options

The `develop` command in the admin CLI allows you to run the admin dashboard in development separately from the Medusa backend. If you intend to use it, you should typically add it to the `package.json` of the Medusa backend:

```json title="package.json"
{
  "scripts": {
    // other scripts...
    "dev:admin": "medusa-admin develop"
  }
}
```

You can add the following options to the `medusa-admin dev` command:

- `--backend` or `-b`: a string specifying the URL of the Medusa backend. By default, it's the value of the environment variable `MEDUSA_ADMIN_BACKEND_URL`. For example, `medusa-admin dev --backend example.com`.
- `--port` or `-p`: the port to run the admin on. By default, it's `7001`. For example, `medusa-admin dev --port 8000`.

---

## Custom Environment Variables

If you want to set environment variables that you want to access in your admin dashboard's customizations (such as in [widgets](./widgets.md) or [UI routes](./routes.md)), your environment variables must be prefixed with `MEDUSA_ADMIN_`. Otherwise, it won't be loaded within the admin.

For example:

```bash
MEDUSA_ADMIN_CUSTOM_API_KEY=123...
```

---

## Custom Webpack Configurations

:::note

Plugins cannot include webpack customizations.

:::

The admin dashboard uses [Webpack](https://webpack.js.org/) to define the necessary configurations for both the core admin plugin and your extensions. So, for example, everything works out of the box with Tailwind CSS, the admin dependencies, and more.

However, you may have some advanced case where you need to tweak the webpack configurations. For example, you want to support styling your extensions with CSS Modules.

For such use cases, you can extend the default webpack configurations defined in the admin plugin to add your custom configurations.

To do that, create the file `src/admin/webpack.config.js` that uses the `withCustomWebpackConfig` method imported from `@medusajs/admin` to export the extended configurations. The method accepts a callback function that must return an object of [webpack configuration](https://webpack.js.org/configuration/). The callback function accepts two parameters:

1. `config`: the first parameter is an object that holds the default webpack configuration. You should add your configurations to this object, then return it. Not returning the default configurations will lead to the application breaking.
2. `webpack`: the second parameter is the webpack instance.

:::warning

This is an advanced feature and requires knowledge of configuring webpack. If configured wrongly, it may lead to the admin application breaking.

:::

For example:

```js title="src/admin/webpack.config.js"
import { withCustomWebpackConfig } from "@medusajs/admin"

export default withCustomWebpackConfig((config, webpack) => {
  config.plugins.push(
    new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify("production"),
      API_URL: 
        JSON.stringify("https://api.medusa-commerce.com"),
    },
    })
  )
  
  return config
})
```
