import { TypeDocOptions } from "typedoc"
import { baseOptions } from "./base-options.js"
import path from "path"
import { jsonOutputPathPrefix, rootPathPrefix } from "./general.js"
import { modules } from "./references.js"
import {
  customModuleServiceNames,
  customModuleTitles,
  dmlModules,
} from "./references-details.js"
import { FormattingOptionType } from "types"
import { kebabToCamel, kebabToPascal, kebabToSnake, kebabToTitle } from "utils"
import baseSectionsOptions from "./base-section-options.js"
import mergerCustomOptions from "./merger-custom-options/index.js"

const mergerOptions: Partial<TypeDocOptions> = {
  ...baseOptions,
  entryPoints: [path.join(jsonOutputPathPrefix, "*.json")],
  entryPointStrategy: "merge",
  entryDocument: "_index.mdx",
  out: path.join(rootPathPrefix, "www", "apps", "resources", "references"),
  name: "references",
  indexTitle: "Medusa References",
  plugin: [...(baseOptions.plugin || []), "typedoc-plugin-markdown-medusa"],
  excludeReferences: true,
  excludeNotDocumented: true,
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  objectLiteralTypeDeclarationStyle: "component",
  mdxOutput: true,
  maxLevel: 3,
  allReflectionsHaveOwnDocument: [
    ...modules,
    ...dmlModules.map((module) => `${module}-models`),
    "dml",
    "helper-steps",
    "workflows",
  ],
  allReflectionsHaveOwnDocumentInNamespace: ["Utilities"],
  formatting: {
    "*": {
      showCommentsAsHeader: true,
      sections: baseSectionsOptions,
      parameterStyle: "component",
      parameterComponent: "TypeList",
      mdxImports: [`import { TypeList } from "docs-ui"`],
    },
    internal: {
      maxLevel: 1,
    },

    // modules config
    ...modules.reduce((obj, moduleName) => {
      const snakeCaseModuleName = kebabToSnake(moduleName)
      const camelCaseModuleName = kebabToCamel(moduleName)
      const titleModuleName = Object.hasOwn(customModuleTitles, moduleName)
        ? customModuleTitles[moduleName]
        : kebabToTitle(moduleName)
      const moduleServiceName = Object.hasOwn(
        customModuleServiceNames,
        moduleName
      )
        ? customModuleServiceNames[moduleName]
        : `I${kebabToPascal(moduleName)}ModuleService`
      const isDmlModule = dmlModules.includes(moduleName)

      return Object.assign(obj, {
        // module config
        [`^${snakeCaseModuleName}`]: {
          sections: {
            ...baseSectionsOptions,
            member_signature_typeParameters: false,
            member_declaration_typeParameters: false,
          },
          expandMembers: true,
          frontmatterData: {
            displayed_sidebar: `${camelCaseModuleName}Reference`,
          },
        },
        [`^${snakeCaseModuleName}/${moduleServiceName}/methods`]: {
          reflectionDescription: `This documentation provides a reference to the \`{{alias}}\` {{kind}}. This belongs to the ${titleModuleName} Module.`,
          frontmatterData: {
            displayed_sidebar: `${camelCaseModuleName}Reference`,
            slug: `/references/${moduleName}/{{alias}}`,
            sidebar_label: "{{alias}}",
          },
          reflectionTitle: {
            kind: false,
            typeParameters: false,
            suffix: `- ${titleModuleName} Module Reference`,
          },
        },
        [`^${snakeCaseModuleName}/.*${moduleServiceName}/page\\.mdx`]: {
          reflectionDescription: `This section of the documentation provides a reference to the \`${moduleServiceName}\` interface’s methods. This is the interface developers use to use the functionalities provided by the ${titleModuleName} Module.`,
          frontmatterData: {
            displayed_sidebar: `${camelCaseModuleName}Reference`,
            slug: `/references/${moduleName}`,
          },
          reflectionTitle: {
            kind: false,
            typeParameters: false,
            suffix: "Reference",
          },
        },

        // module's model config
        [`^${snakeCaseModuleName}_models`]: {
          frontmatterData: {
            displayed_sidebar: `${camelCaseModuleName}ModelReference`,
            slug: `/references/${moduleName}/models/{{alias}}`,
            sidebar_label: "{{alias}}",
          },
          reflectionDescription: `This documentation provides a reference to the {{alias}} {{kind}}. This belongs to the ${titleModuleName} Module.`,
          reflectionTitle: {
            kind: false,
            typeParameters: false,
            suffix: `- ${titleModuleName} Module Data Models Reference`,
          },
          reflectionGroups: isDmlModule
            ? {
                Variables: true,
              }
            : {
                Constructors: false,
                Functions: false,
                Methods: false,
              },
        },
        [`^modules/${snakeCaseModuleName}_models`]: {
          reflectionDescription: `This documentation provides a reference to the data models in the ${titleModuleName} Module`,
          frontmatterData: {
            displayed_sidebar: `${camelCaseModuleName}ModelReference`,
            slug: `/references/${moduleName}/models`,
          },
          reflectionTitle: {
            fullReplacement: `${titleModuleName} Module Data Models Reference`,
          },
          reflectionGroupRename: isDmlModule
            ? {
                Variables: "Data Models",
              }
            : {},
        },
      } as FormattingOptionType)
    }, {} as FormattingOptionType),

    ...mergerCustomOptions,
  },
}

export default mergerOptions
