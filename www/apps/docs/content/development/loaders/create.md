---
description: 'Learn how to create a loader in Medusa. A loader can be created in the Medusa backend codebase, in a plugin, or in a module.'
addHowToData: true
---

# How to Create a Loader

In this document, you’ll learn how to create a loader in Medusa. A loader can be created in the Medusa backend codebase, in a plugin, or in a module.

## Step 1: Create Loader File

Create a TypeScript or JavaScript file in the `src/loaders` directory that will hold your custom script. There are no restrictions on the name of the file.

For example, create the file `src/loaders/my-loader.ts` that will hold the loader.

---

## Step 2: Define the Loader

The loader file must export a function.

### Parameters of Loaders in Medusa Backend and Plugins

When the loader is defined in the Medusa backend or a plugin, the function receives the following parameters:

1. `container`: the first parameter, which is a `MedusaContainer` object. You can use the container to register custom resources into the dependency container or resolve resources from the dependency container.
2. `config`: the second parameter, which is an object that holds the loader’s plugin options. If the loader is not created inside a plugin, the config object will be empty.

### Parameters of Loaders in Modules

When the loader is defined in a module, it receives the following parameters:

1. `container`: the first parameter, which is a `MedusaContainer` object. You can use the container to register custom resources into the dependency container or resolve resources from the dependency container.
2. `logger`: the second parameter, which is a `Logger` object. The logger can be used to log messages in the console.
3. `config`: the third parameter, which is an object that holds the loader’s module options.

### Example Implementation

For example, this loader function resolves the `ProductService` and logs in the console the count of products in the Medusa backend:

```ts title="src/loaders/my-loader.ts"
import { 
  ProductService, 
  ConfigModule,
  MedusaContainer,
} from "@medusajs/medusa"

export default async (
  container: MedusaContainer,
  config: ConfigModule
): Promise<void> => {
  console.info("Starting loader...")
  const productService = container.resolve<ProductService>(
    "productService"
  )
  console.info(`Products count: ${
    await productService.count()
  }`)
  console.info("Ending loader...")
}
```

---

## Step 3: Run Build Command

In the directory of your project, run the following command to transpile the files from the `src` to the `dist` directory:

```bash npm2yarn
npm run build
```

---

## Test it Out

:::note

This section explains how to test out the loader if it’s created in the Medusa backend codebase. If you’re creating your loader in a plugin, you can learn how to test it in the [plugins documentation](../plugins/create.mdx#test-your-plugin). Alternatively, if you’re creating your loader in a module, you can learn how to test it in the [modules documentation](../modules/create.mdx#step-4-test-your-module).

:::

Run the following command to start the Medusa backend:

```bash npm2yarn
npx medusa develop
```

Your loader script should run on the Medusa backend startup. If you logged a message in the console, similar to the example above, you should see it in the console.
