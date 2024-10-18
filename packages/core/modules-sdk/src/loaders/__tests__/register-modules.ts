import { InternalModuleDeclaration, ModuleDefinition } from "@medusajs/types"
import { ModulesDefinition } from "../../definitions"
import { MODULE_SCOPE } from "../../types"
import { registerMedusaModule } from "../register-modules"

const testServiceResolved = require.resolve(
  "../__fixtures__/test-service-resolved"
)
const defaultTestService = require.resolve("../__fixtures__/test-service")

describe("module definitions loader", () => {
  const defaultDefinition: ModuleDefinition = {
    key: "testService",
    defaultPackage: defaultTestService,
    label: "TestService",
    isRequired: false,
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  }

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    // Clear module definitions
    const allProperties = Object.getOwnPropertyNames(ModulesDefinition)
    allProperties.forEach((property) => {
      delete ModulesDefinition[property]
    })
  })

  it("Resolves module with default definition given empty config", () => {
    Object.assign(ModulesDefinition, {
      [defaultDefinition.key]: defaultDefinition,
    })

    const res = registerMedusaModule(defaultDefinition.key)

    expect(res[defaultDefinition.key]).toEqual(
      expect.objectContaining({
        resolutionPath: defaultDefinition.defaultPackage,
        definition: defaultDefinition,
        options: {},
        moduleDeclaration: {
          scope: "internal",
        },
      })
    )
  })

  it("Resolves a custom module without pre-defined definition", () => {
    const res = registerMedusaModule("customModulesABC", {
      resolve: testServiceResolved,
      options: {
        test: 123,
      },
    })

    expect(res).toEqual({
      customModulesABC: expect.objectContaining({
        resolutionPath: testServiceResolved,
        definition: expect.objectContaining({
          key: "customModulesABC",
          label: "Custom: customModulesABC",
        }),
        moduleDeclaration: {
          scope: "internal",
        },
        options: {
          test: 123,
        },
      }),
    })
  })

  describe("boolean config", () => {
    it("Resolves module with no resolution path when given false", () => {
      Object.assign(ModulesDefinition, {
        [defaultDefinition.key]: defaultDefinition,
      })

      const res = registerMedusaModule(defaultDefinition.key, false)

      expect(res[defaultDefinition.key]).toEqual(
        expect.objectContaining({
          resolutionPath: false,
          definition: defaultDefinition,
          options: {},
        })
      )
    })

    it("Fails to resolve module with no resolution path when given false for a required module", () => {
      expect.assertions(1)
      Object.assign(ModulesDefinition, {
        [defaultDefinition.key]: { ...defaultDefinition, isRequired: true },
      })

      try {
        registerMedusaModule(defaultDefinition.key, false)
      } catch (err) {
        expect(err.message).toEqual(
          `Module: ${defaultDefinition.label} is required`
        )
      }
    })
  })

  it("Module with no resolution path when not given custom resolution path, false as default package and required", () => {
    const definition = {
      ...defaultDefinition,
      defaultPackage: false as false,
      isRequired: true,
    }

    Object.assign(ModulesDefinition, {
      [defaultDefinition.key]: definition,
    })

    const res = registerMedusaModule(defaultDefinition.key)

    expect(res[defaultDefinition.key]).toEqual(
      expect.objectContaining({
        resolutionPath: false,
        definition: definition,
        options: {},
        moduleDeclaration: {
          scope: "internal",
        },
      })
    )
  })

  describe("string config", () => {
    it("Resolves module with default definition given empty config", () => {
      Object.assign(ModulesDefinition, {
        [defaultDefinition.key]: defaultDefinition,
      })

      const res = registerMedusaModule(
        defaultDefinition.key,
        defaultDefinition.defaultPackage
      )

      expect(res[defaultDefinition.key]).toEqual(
        expect.objectContaining({
          resolutionPath: defaultTestService,
          definition: defaultDefinition,
          options: {},
          moduleDeclaration: {
            scope: "internal",
          },
        })
      )
    })
  })

  describe("object config", () => {
    it("Resolves resolution path and provides empty options when none are provided", () => {
      Object.assign(ModulesDefinition, {
        [defaultDefinition.key]: defaultDefinition,
      })

      const res = registerMedusaModule(defaultDefinition.key, {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: defaultDefinition.defaultPackage,
      } as InternalModuleDeclaration)

      expect(res[defaultDefinition.key]).toEqual(
        expect.objectContaining({
          resolutionPath: defaultTestService,
          definition: defaultDefinition,
          options: {},
          moduleDeclaration: {
            scope: "internal",

            resolve: defaultDefinition.defaultPackage,
          },
        })
      )
    })

    it("Resolves default resolution path and provides options when only options are provided", () => {
      Object.assign(ModulesDefinition, {
        [defaultDefinition.key]: defaultDefinition,
      })

      const res = registerMedusaModule(defaultDefinition.key, {
        options: { test: 123 },
      } as any)

      expect(res[defaultDefinition.key]).toEqual(
        expect.objectContaining({
          resolutionPath: defaultDefinition.defaultPackage,
          definition: defaultDefinition,
          options: { test: 123 },
          moduleDeclaration: {
            scope: "internal",

            options: { test: 123 },
          },
        })
      )
    })

    it("Resolves resolution path and provides options when only options are provided", () => {
      Object.assign(ModulesDefinition, {
        [defaultDefinition.key]: defaultDefinition,
      })

      const res = registerMedusaModule(defaultDefinition.key, {
        resolve: defaultDefinition.defaultPackage,
        options: { test: 123 },
        scope: "internal",
      } as any)

      expect(res[defaultDefinition.key]).toEqual(
        expect.objectContaining({
          resolutionPath: defaultTestService,
          definition: defaultDefinition,
          options: { test: 123 },
          moduleDeclaration: {
            scope: "internal",

            resolve: defaultDefinition.defaultPackage,
            options: { test: 123 },
          },
        })
      )
    })
  })
})
