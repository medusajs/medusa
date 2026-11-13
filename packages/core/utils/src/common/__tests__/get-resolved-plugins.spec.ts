import { mkdir, realpath, symlink } from "fs/promises"
import path from "path"
import { defineConfig } from "../define-config"
import { FileSystem } from "../file-system"
import { getResolvedPlugins } from "../get-resolved-plugins"

const BASE_DIR = path.join(__dirname, "sample-proj")
const fs = new FileSystem(BASE_DIR)

afterEach(async () => {
  await fs.cleanup()
})

describe("getResolvedPlugins | relative paths", () => {
  test("resolve configured plugins", async () => {
    await fs.createJson("node_modules/@medusajs/draft-order/package.json", {
      name: "@medusajs/draft-order",
      version: "1.0.0",
    })

    await fs.createJson("plugins/dummy/package.json", {
      name: "my-dummy-plugin",
      version: "1.0.0",
    })

    const plugins = await getResolvedPlugins(
      fs.basePath,
      defineConfig({
        plugins: [
          {
            resolve: "./plugins/dummy",
            options: {
              apiKey: "asecret",
            },
          },
          {
            resolve: "@medusajs/draft-order",
            options: {},
          },
        ],
      }),
      false
    )

    expect(plugins).toEqual(
      expect.arrayContaining([
        {
          id: "@medusajs/draft-order",
          modules: [],
          name: "@medusajs/draft-order",
          options: {},
          resolve: path.join(
            fs.basePath,
            "node_modules/@medusajs/draft-order/.medusa/server/src"
          ),
          version: "1.0.0",
        },
        {
          resolve: path.join(fs.basePath, "./plugins/dummy/.medusa/server/src"),
          admin: undefined,
          name: "my-dummy-plugin",
          id: "my-dummy-plugin",
          options: { apiKey: "asecret" },
          version: "1.0.0",
          modules: [],
        },
      ])
    )
  })

  test("scan plugin modules", async () => {
    await fs.createJson("node_modules/@medusajs/draft-order/package.json", {
      name: "@medusajs/draft-order",
      version: "1.0.0",
    })
    await fs.createJson("plugins/dummy/package.json", {
      name: "my-dummy-plugin",
      version: "1.0.0",
    })
    await fs.create(
      "plugins/dummy/.medusa/server/src/modules/blog/index.js",
      ``
    )

    const plugins = await getResolvedPlugins(
      fs.basePath,
      defineConfig({
        plugins: [
          {
            resolve: "./plugins/dummy",
            options: {
              apiKey: "asecret",
            },
          },
        ],
      }),
      false
    )

    expect(plugins).toEqual(expect.arrayContaining([
      {
        resolve: path.join(fs.basePath, "./plugins/dummy/.medusa/server/src"),
        admin: undefined,
        name: "my-dummy-plugin",
        id: "my-dummy-plugin",
        options: { apiKey: "asecret" },
        version: "1.0.0",
        modules: [
          {
            options: {
              apiKey: "asecret",
            },
            resolve: "./plugins/dummy/.medusa/server/src/modules/blog",
          },
        ],
      },
      {
        id: "@medusajs/draft-order",
        modules: [],
        name: "@medusajs/draft-order",
        options: {},
        resolve: path.join(
          fs.basePath,
          "node_modules/@medusajs/draft-order/.medusa/server/src"
        ),
        version: "1.0.0",
      },
    ]))
  })

  test("throw error when package.json file is missing", async () => {
    await fs.createJson("node_modules/@medusajs/draft-order/package.json", {
      name: "@medusajs/draft-order",
      version: "1.0.0",
    })

    const resolvePlugins = async () =>
      getResolvedPlugins(
        fs.basePath,
        defineConfig({
          plugins: [
            {
              resolve: "./plugins/dummy",
              options: {
                apiKey: "asecret",
              },
            },
          ],
        }),
        false
      )

    await expect(resolvePlugins()).rejects.toThrow(
      `Unable to resolve plugin "./plugins/dummy". Make sure the plugin directory has a package.json file`
    )
  })

  test("resolve admin source from medusa-plugin-options file", async () => {
    await fs.createJson("node_modules/@medusajs/draft-order/package.json", {
      name: "@medusajs/draft-order",
      version: "1.0.0",
    })
    await fs.createJson("plugins/dummy/package.json", {
      name: "my-dummy-plugin",
      version: "1.0.0",
    })
    await fs.create(
      "plugins/dummy/.medusa/server/src/modules/blog/index.js",
      ``
    )
    await fs.createJson(
      "plugins/dummy/.medusa/server/medusa-plugin-options.json",
      {
        srcDir: path.join(fs.basePath, "plugins/dummy/src"),
      }
    )

    const plugins = await getResolvedPlugins(
      fs.basePath,
      defineConfig({
        plugins: [
          {
            resolve: "./plugins/dummy",
            options: {
              apiKey: "asecret",
            },
          },
          {
            resolve: "@medusajs/draft-order",
            options: {},
          },
        ],
      }),
      false
    )

    expect(plugins).toEqual(expect.arrayContaining([
      {
        resolve: path.join(fs.basePath, "./plugins/dummy/.medusa/server/src"),
        admin: {
          type: "local",
          resolve: path.join(fs.basePath, "./plugins/dummy/src/admin"),
        },
        name: "my-dummy-plugin",
        id: "my-dummy-plugin",
        options: { apiKey: "asecret" },
        version: "1.0.0",
        modules: [
          {
            options: {
              apiKey: "asecret",
            },
            resolve: "./plugins/dummy/.medusa/server/src/modules/blog",
          },
        ],
      },
      {
        id: "@medusajs/draft-order",
        modules: [],
        name: "@medusajs/draft-order",
        options: {},
        resolve: path.join(
          fs.basePath,
          "node_modules/@medusajs/draft-order/.medusa/server/src"
        ),
        version: "1.0.0",
      },
    ]))
  })
})

describe("getResolvedPlugins | package reference", () => {
  test("resolve configured plugins", async () => {
    await fs.createJson("node_modules/@medusajs/draft-order/package.json", {
      name: "@medusajs/draft-order",
      version: "1.0.0",
    })
    await fs.createJson("package.json", {})
    await fs.createJson("node_modules/@plugins/dummy/package.json", {
      name: "my-dummy-plugin",
      version: "1.0.0",
    })

    const plugins = await getResolvedPlugins(
      fs.basePath,
      defineConfig({
        plugins: [
          {
            resolve: "@plugins/dummy",
            options: {
              apiKey: "asecret",
            },
          },
        ],
      }),
      false
    )

    expect(plugins).toEqual(expect.arrayContaining([
      {
        resolve: path.join(
          fs.basePath,
          "node_modules/@plugins/dummy/.medusa/server/src"
        ),
        admin: undefined,
        name: "my-dummy-plugin",
        id: "my-dummy-plugin",
        options: { apiKey: "asecret" },
        version: "1.0.0",
        modules: [],
      },
      {
        id: "@medusajs/draft-order",
        modules: [],
        name: "@medusajs/draft-order",
        options: {},
        resolve: path.join(
          fs.basePath,
          "node_modules/@medusajs/draft-order/.medusa/server/src"
        ),
        version: "1.0.0",
      },
    ]))
  })

  test("scan plugin modules", async () => {
    await fs.createJson("node_modules/@medusajs/draft-order/package.json", {
      name: "@medusajs/draft-order",
      version: "1.0.0",
    })
    await fs.createJson("package.json", {})
    await fs.createJson("node_modules/@plugins/dummy/package.json", {
      name: "my-dummy-plugin",
      version: "1.0.0",
    })
    await fs.create(
      "node_modules/@plugins/dummy/.medusa/server/src/modules/blog/index.js",
      ``
    )

    const plugins = await getResolvedPlugins(
      fs.basePath,
      defineConfig({
        plugins: [
          {
            resolve: "@plugins/dummy",
            options: {
              apiKey: "asecret",
            },
          },
        ],
      }),
      false
    )

    expect(plugins).toEqual(expect.arrayContaining([
      {
        resolve: path.join(
          fs.basePath,
          "node_modules/@plugins/dummy/.medusa/server/src"
        ),
        admin: undefined,
        name: "my-dummy-plugin",
        id: "my-dummy-plugin",
        options: { apiKey: "asecret" },
        version: "1.0.0",
        modules: [
          {
            options: {
              apiKey: "asecret",
            },
            resolve: "@plugins/dummy/.medusa/server/src/modules/blog",
          },
        ],
      },
      {
        id: "@medusajs/draft-order",
        modules: [],
        name: "@medusajs/draft-order",
        options: {},
        resolve: path.join(
          fs.basePath,
          "node_modules/@medusajs/draft-order/.medusa/server/src"
        ),
        version: "1.0.0",
      },
    ]))
  })

  test("throw error when package.json file is missing", async () => {
    await fs.createJson("node_modules/@medusajs/draft-order/package.json", {
      name: "@medusajs/draft-order",
      version: "1.0.0",
    })
    const resolvePlugins = async () =>
      getResolvedPlugins(
        fs.basePath,
        defineConfig({
          plugins: [
            {
              resolve: "@plugins/dummy",
              options: {
                apiKey: "asecret",
              },
            },
            {
              resolve: "@medusajs/draft-order",
              options: {},
            },
          ],
        }),
        false
      )

    await expect(resolvePlugins()).rejects.toThrow(
      `Unable to resolve plugin "@plugins/dummy". Make sure the plugin directory has a package.json file`
    )
  })

  test("resolve a plugin installed as a dependency of @medusajs/medusa", async () => {
    const storeDir = "store/node_modules/@medusajs"
    await fs.createJson(`${storeDir}/medusa/package.json`, {
      name: "@medusajs/medusa",
    })
    await fs.createJson(`${storeDir}/transitive-plugin/package.json`, {
      name: "@medusajs/transitive-plugin",
      version: "1.0.0",
    })
    await fs.create(
      `${storeDir}/transitive-plugin/.medusa/server/src/modules/module-1/index.js`,
      ""
    )

    await fs.createJson("project/package.json", {})
    await mkdir(path.join(fs.basePath, "project/node_modules/@medusajs"), {
      recursive: true,
    })
    await symlink(
      path.join(fs.basePath, storeDir, "medusa"),
      path.join(fs.basePath, "project/node_modules/@medusajs/medusa"),
      "dir"
    )

    const pluginDir = await realpath(
      path.join(fs.basePath, storeDir, "transitive-plugin")
    )

    const plugins = await getResolvedPlugins(
      path.join(fs.basePath, "project"),
      {
        plugins: [{ resolve: "@medusajs/transitive-plugin", options: {} }],
      } as any,
      false
    )

    expect(plugins).toEqual([
      {
        id: "@medusajs/transitive-plugin",
        admin: undefined,
        modules: [
          {
            options: {},
            resolve: `${pluginDir}/.medusa/server/src/modules/module-1`,
          },
        ],
        name: "@medusajs/transitive-plugin",
        options: {},
        resolve: path.join(pluginDir, ".medusa/server/src"),
        version: "1.0.0",
      },
    ])
  })
})
