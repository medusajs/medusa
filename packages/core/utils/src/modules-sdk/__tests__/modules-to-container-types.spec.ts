import { join } from "path"
import { FileSystem } from "../../common"
import { generateContainerTypes } from "../modules-to-container-types"

const fileSystem = new FileSystem(join(__dirname, "./tmp"))

afterEach(async () => {
  await fileSystem.cleanup()
})

describe("generateContainerTypes", function () {
  it("should create file with types for provided modules", async function () {
    await generateContainerTypes(
      {
        cache: {
          __definition: {
            key: "foo-cache",
            label: "Cache",
            defaultPackage: "@zjedene-medusa/foo-cache",
            resolvePath: "@zjedene-medusa/foo-cache",
            defaultModuleDeclaration: {
              scope: "internal",
            },
          },
          __joinerConfig: {},
        },
      },
      {
        outputDir: fileSystem.basePath,
        interfaceName: "ModulesImplementations",
      }
    )

    expect(await fileSystem.exists("modules-bindings.d.ts")).toBeTruthy()
    expect(await fileSystem.contents("modules-bindings.d.ts"))
      .toMatchInlineSnapshot(`
      "import type FooCache from '@zjedene-medusa/foo-cache'

      declare module '@zjedene-medusa/framework/types' {
        interface ModulesImplementations {
          'foo-cache': InstanceType<(typeof FooCache)['service']>
        }
      }"
    `)
  })

  it("point inbuilt packages to their interfaces", async function () {
    await generateContainerTypes(
      {
        cache: {
          __definition: {
            key: "cache",
            label: "Cache",
            defaultPackage: "@zjedene-medusa/foo-cache",
            resolvePath: "@zjedene-medusa/foo-cache",
            defaultModuleDeclaration: {
              scope: "internal",
            },
          },
          __joinerConfig: {},
        },
      },
      {
        outputDir: fileSystem.basePath,
        interfaceName: "ModulesImplementations",
      }
    )

    expect(await fileSystem.exists("modules-bindings.d.ts")).toBeTruthy()
    expect(await fileSystem.contents("modules-bindings.d.ts"))
      .toMatchInlineSnapshot(`
      "import type { ICacheService } from '@zjedene-medusa/framework/types'

      declare module '@zjedene-medusa/framework/types' {
        interface ModulesImplementations {
          'cache': ICacheService
        }
      }"
    `)
  })

  it("should normalize module path pointing to a relative file", async function () {
    await generateContainerTypes(
      {
        bar: {
          __definition: {
            key: "bar",
            label: "Bar",
            defaultPackage: "./foo/bar",
            resolvePath: "./foo/bar",
            defaultModuleDeclaration: {
              scope: "internal",
            },
          },
          __joinerConfig: {},
        },
      },
      {
        outputDir: fileSystem.basePath,
        interfaceName: "ModulesImplementations",
      }
    )

    expect(await fileSystem.exists("modules-bindings.d.ts")).toBeTruthy()
    expect(await fileSystem.contents("modules-bindings.d.ts"))
      .toMatchInlineSnapshot(`
      "import type Bar from '../../foo/bar'

      declare module '@zjedene-medusa/framework/types' {
        interface ModulesImplementations {
          'bar': InstanceType<(typeof Bar)['service']>
        }
      }"
    `)
  })
})
