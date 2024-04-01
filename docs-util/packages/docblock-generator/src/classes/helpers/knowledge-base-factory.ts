import ts from "typescript"
import { DOCBLOCK_DOUBLE_LINES, DOCBLOCK_NEW_LINE } from "../../constants.js"
import {
  camelToTitle,
  camelToWords,
  normalizeName,
  snakeToWords,
} from "../../utils/str-formatting.js"
import pluralize from "pluralize"

type TemplateOptions = {
  pluralIndicatorStr?: string
  parentName?: string
  rawParentName?: string
  returnTypeName?: string
}

type KnowledgeBase = {
  startsWith?: string
  endsWith?: string
  exact?: string
  pattern?: RegExp
  template:
    | string
    | ((str: string, options?: TemplateOptions) => string | undefined)
  kind?: ts.SyntaxKind[]
}

export type RetrieveOptions = {
  /**
   * A name that can be of a function, type, etc...
   */
  str: string
  /**
   * Options to pass to the `template` function of a
   * knowledge base item.
   */
  templateOptions?: TemplateOptions
  /**
   * The kind of the associated node.
   */
  kind?: ts.SyntaxKind
}

type RetrieveSymbolOptions = Omit<RetrieveOptions, "str"> & {
  /**
   * The symbol to retrieve the item from the knowledge base.
   */
  symbol: ts.Symbol
}

/**
 * A class that holds common Medusa patterns and acts as a knowledge base for possible summaries/examples/general templates.
 */
class KnowledgeBaseFactory {
  private TYPE_PLACEHOLDER = `{type name}`
  private summaryKnowledgeBase: KnowledgeBase[] = [
    {
      startsWith: "FindConfig",
      template: (str) => {
        const typeArgs = str
          .replace("FindConfig<", "")
          .replace(/>$/, "")
          .split(",")
          .map((part) => camelToWords(normalizeName(part.trim())))
        const typeName =
          typeArgs.length > 0 && typeArgs[0].length > 0
            ? typeArgs[0]
            : this.TYPE_PLACEHOLDER
        return `The configurations determining how the ${typeName} is retrieved. Its properties, such as \`select\` or \`relations\`, accept the ${DOCBLOCK_NEW_LINE}attributes or relations associated with a ${typeName}.`
      },
    },
    {
      startsWith: "Filterable",
      endsWith: "Props",
      template: (str) => {
        return `The filters to apply on the retrieved ${camelToWords(
          normalizeName(str)
        )}s.`
      },
    },
    {
      startsWith: "Create",
      endsWith: "DTO",
      template: (str, options) => {
        const isPlural = this.isTypePlural(options?.pluralIndicatorStr)
        return `The ${camelToWords(normalizeName(str))}${
          isPlural ? "s" : ""
        } to be created.`
      },
    },
    {
      startsWith: "Update",
      endsWith: "DTO",
      template: (str, options) => {
        const isPlural = this.isTypePlural(options?.pluralIndicatorStr)
        return `The attributes to update in the ${camelToWords(
          normalizeName(str)
        )}${isPlural ? "s" : ""}.`
      },
    },
    {
      endsWith: "UpdatableFields",
      template: (str, options) => {
        const isPlural = this.isTypePlural(options?.pluralIndicatorStr)
        return `The attributes to update in the ${camelToWords(
          normalizeName(str)
        )}${isPlural ? "s" : ""}.`
      },
    },
    {
      startsWith: "Upsert",
      endsWith: "DTO",
      template: (str, options) => {
        const isPlural = this.isTypePlural(options?.pluralIndicatorStr)
        return `The attributes in the ${camelToWords(normalizeName(str))}${
          isPlural ? "s" : ""
        } to be created or updated.`
      },
    },
    {
      startsWith: "RestoreReturn",
      template: (_str, options) => {
        return this.replaceTypePlaceholder(
          `Configurations determining which relations to restore along with each of the ${this.TYPE_PLACEHOLDER}. You can pass to its \`returnLinkableKeys\` ${DOCBLOCK_NEW_LINE}property any of the ${this.TYPE_PLACEHOLDER}'s relation attribute names, such as \`{type relation name}\`.`,
          options
        )
      },
    },
    {
      endsWith: "DTO",
      template: (str, options) => {
        const isPlural = this.isTypePlural(options?.pluralIndicatorStr)
        return `The ${camelToWords(normalizeName(str))}${
          isPlural ? "s" : ""
        } details.`
      },
    },
    {
      endsWith: "_id",
      template: (str: string): string => {
        const formatted = str.replace(/_id$/, "").split("_").join(" ")

        return `The associated ${formatted}'s ID.`
      },
      kind: [ts.SyntaxKind.PropertySignature],
    },
    {
      endsWith: "Id",
      template: (str: string): string => {
        const formatted = camelToWords(str.replace(/Id$/, ""))

        return `The ${formatted}'s ID.`
      },
      kind: [
        ts.SyntaxKind.PropertySignature,
        ts.SyntaxKind.PropertyDeclaration,
        ts.SyntaxKind.Parameter,
      ],
    },
    {
      exact: "id",
      template: (str, options) => {
        if (options?.rawParentName?.startsWith("Filterable")) {
          return `The IDs to filter the ${options?.parentName || `{name}`}s by.`
        }
        const parentName = options?.parentName
          ? options.parentName
          : options?.rawParentName
            ? camelToWords(normalizeName(options.rawParentName))
            : `{name}`
        return `The ID of the ${parentName}.`
      },
      kind: [ts.SyntaxKind.PropertySignature],
    },
    {
      exact: "ids",
      template: (str, options) => {
        if (options?.rawParentName?.startsWith("Filterable")) {
          return `The IDs to filter the ${options?.parentName || `{name}`} by.`
        }
        const parentName = options?.parentName
          ? options.parentName
          : options?.rawParentName
            ? camelToWords(normalizeName(options.rawParentName))
            : `{name}`
        return `The IDs of the ${parentName}.`
      },
      kind: [ts.SyntaxKind.PropertySignature],
    },
    {
      exact: "metadata",
      template: "Holds custom data in key-value pairs.",
      kind: [ts.SyntaxKind.PropertySignature],
    },
    {
      exact: "customHeaders",
      template: "Custom headers to attach to the request.",
    },
    {
      startsWith: "I",
      endsWith: "ModuleService",
      template: (str) => {
        const normalizedStr = camelToTitle(normalizeName(str))

        return `The main service interface for the ${normalizedStr} Module.`
      },
    },
  ]
  private functionSummaryKnowledgeBase: KnowledgeBase[] = [
    {
      startsWith: "listAndCount",
      template: (_str, options) => {
        return this.replaceTypePlaceholder(
          `retrieves a paginated list of ${this.TYPE_PLACEHOLDER}s along with the total count of available ${this.TYPE_PLACEHOLDER}s satisfying the provided filters.`,
          options
        )
      },
    },
    {
      startsWith: "list",
      template: (_str, options) => {
        return this.replaceTypePlaceholder(
          `retrieves a paginated list of ${this.TYPE_PLACEHOLDER}s based on optional filters and configuration.`,
          options
        )
      },
    },
    {
      startsWith: "retrieve",
      template: (_str, options) => {
        return this.replaceTypePlaceholder(
          `retrieves a ${this.TYPE_PLACEHOLDER} by its ID.`,
          options
        )
      },
    },
    {
      startsWith: "create",
      template: (_str, options) => {
        const isPlural = this.isTypePlural(options?.pluralIndicatorStr)
        return this.replaceTypePlaceholder(
          `creates${!isPlural ? " a" : ""} ${this.TYPE_PLACEHOLDER}${
            isPlural ? "s" : ""
          }.`,
          options
        )
      },
    },
    {
      startsWith: "delete",
      template: (_str, options) => {
        const isPlural = this.isTypePlural(options?.pluralIndicatorStr)
        return this.replaceTypePlaceholder(
          `deletes${!isPlural ? " a" : ""} ${this.TYPE_PLACEHOLDER} by ${
            isPlural ? "their" : "its"
          } ID${isPlural ? "s" : ""}.`,
          options
        )
      },
    },
    {
      startsWith: "update",
      template: (_str, options) => {
        const isPlural = this.isTypePlural(options?.pluralIndicatorStr)
        return this.replaceTypePlaceholder(
          `updates${!isPlural ? " an" : ""} existing ${this.TYPE_PLACEHOLDER}${
            isPlural ? "s" : ""
          }.`,
          options
        )
      },
    },
    {
      startsWith: "softDelete",
      template: (_str, options) => {
        const isPlural = this.isTypePlural(options?.pluralIndicatorStr)
        return this.replaceTypePlaceholder(
          `soft deletes${!isPlural ? " a" : ""} ${this.TYPE_PLACEHOLDER}${
            isPlural ? "s" : ""
          } by ${isPlural ? "their" : "its"} IDs.`,
          options
        )
      },
    },
    {
      startsWith: "restore",
      template: (_str, options) => {
        const isPlural = this.isTypePlural(options?.pluralIndicatorStr)
        return this.replaceTypePlaceholder(
          `restores${!isPlural ? " a" : ""} soft deleted ${
            this.TYPE_PLACEHOLDER
          }${isPlural ? "s" : ""} by ${isPlural ? "their" : "its"} IDs.`,
          options
        )
      },
    },
    {
      startsWith: "upsert",
      template: (_str, options) => {
        const isPlural = this.isTypePlural(options?.pluralIndicatorStr)
        return this.replaceTypePlaceholder(
          `updates or creates${!isPlural ? " a" : ""} ${this.TYPE_PLACEHOLDER}${
            isPlural ? "s" : ""
          } if ${isPlural ? "they don't" : "it doesn't"} exist.`,
          options
        )
      },
    },
  ]
  private functionReturnKnowledgeBase: KnowledgeBase[] = [
    {
      startsWith: "listAndCount",
      template: (_str, options) => {
        return this.replaceTypePlaceholder(
          `The list of ${this.TYPE_PLACEHOLDER}s along with their total count.`,
          options
        )
      },
    },
    {
      startsWith: "list",
      template: (_str, options) => {
        return this.replaceTypePlaceholder(
          `The list of ${this.TYPE_PLACEHOLDER}s.`,
          options
        )
      },
    },
    {
      startsWith: "retrieve",
      template: (_str, options) => {
        return this.replaceTypePlaceholder(
          `The retrieved ${this.TYPE_PLACEHOLDER}.`,
          options
        )
      },
    },
    {
      startsWith: "create",
      template: (_str, options) => {
        const isPlural = this.isTypePlural(options?.pluralIndicatorStr)
        return this.replaceTypePlaceholder(
          `The created ${this.TYPE_PLACEHOLDER}${isPlural ? "s" : ""}.`,
          options
        )
      },
    },
    {
      startsWith: "update",
      template: (_str, options) => {
        const isPlural = this.isTypePlural(options?.pluralIndicatorStr)
        return this.replaceTypePlaceholder(
          `The updated ${this.TYPE_PLACEHOLDER}${isPlural ? "s" : ""}.`,
          options
        )
      },
    },
    {
      startsWith: "upsert",
      template: (_str, options) => {
        const isPlural = this.isTypePlural(options?.pluralIndicatorStr)
        return this.replaceTypePlaceholder(
          `The created or updated ${this.TYPE_PLACEHOLDER}${
            isPlural ? "s" : ""
          }.`,
          options
        )
      },
    },
    {
      startsWith: "softDelete",
      template: (_str, options) => {
        return this.replaceTypePlaceholder(
          `An object that includes the IDs of related records that were also soft deleted, such as the ID of the associated {related entity name}. ${DOCBLOCK_NEW_LINE}The object's keys are the ID attribute names of the ${this.TYPE_PLACEHOLDER} entity's relations, such as \`{relation ID field name}\`, and its value is an array of strings, each being the ID of a record associated ${DOCBLOCK_NEW_LINE}with the ${this.TYPE_PLACEHOLDER} through this relation, such as the IDs of associated {related entity name}.${DOCBLOCK_DOUBLE_LINES}If there are no related records, the promise resolves to \`void\`.`,
          options
        )
      },
    },
    {
      startsWith: "restore",
      template: (_str, options) => {
        return this.replaceTypePlaceholder(
          `An object that includes the IDs of related records that were restored, such as the ID of associated {relation name}. ${DOCBLOCK_NEW_LINE}The object's keys are the ID attribute names of the ${this.TYPE_PLACEHOLDER} entity's relations, such as \`{relation ID field name}\`, ${DOCBLOCK_NEW_LINE}and its value is an array of strings, each being the ID of the record associated with the ${this.TYPE_PLACEHOLDER} through this relation, ${DOCBLOCK_NEW_LINE}such as the IDs of associated {relation name}.${DOCBLOCK_DOUBLE_LINES}If there are no related records restored, the promise resolves to \`void\`.`,
          options
        )
      },
    },
  ]
  private oasDescriptionKnowledgeBase: KnowledgeBase[] = [
    {
      pattern: /.*/,
      template(str, options) {
        if (!options?.parentName) {
          return
        }

        const formattedName = str === "id" ? "ID" : snakeToWords(str)
        const formattedParentName = pluralize.singular(
          snakeToWords(options.parentName)
        )

        if (formattedName === formattedParentName) {
          return `The ${formattedParentName}'s details.`
        }

        return `The ${formattedParentName}'s ${formattedName}.`
      },
    },
  ]

  /**
   * Tries to find in a specified knowledge base a template relevant to the specified name.
   *
   * @returns {string | undefined} The matching knowledge base template, if found.
   */
  private tryToFindInKnowledgeBase({
    str,
    knowledgeBase,
    templateOptions,
    kind,
  }: RetrieveOptions & {
    /**
     * A knowledge base to search in.
     */
    knowledgeBase: KnowledgeBase[]
  }): string | undefined {
    const foundItem = knowledgeBase.find((item) => {
      if (item.exact) {
        return str === item.exact
      }

      if (item.pattern) {
        return item.pattern.test(str)
      }

      if (item.kind?.length && (!kind || !item.kind.includes(kind))) {
        return false
      }

      if (item.startsWith && item.endsWith) {
        return str.startsWith(item.startsWith) && str.endsWith(item.endsWith)
      }

      if (item.startsWith) {
        return str.startsWith(item.startsWith)
      }

      return item.endsWith ? str.endsWith(item.endsWith) : false
    })

    if (!foundItem) {
      return
    }

    return typeof foundItem.template === "string"
      ? foundItem?.template
      : foundItem?.template(str, templateOptions)
  }

  /**
   * This method replaces uses of {@link TYPE_PLACEHOLDER} with the normalized parent name, if provided.
   *
   * @param str - The string to normalize
   * @param options - The template options
   * @returns The normalized string
   */
  private replaceTypePlaceholder(
    str: string,
    options?: TemplateOptions
  ): string {
    const typeName = options?.rawParentName
      ? camelToWords(normalizeName(options.rawParentName))
      : this.TYPE_PLACEHOLDER

    return str.replaceAll(this.TYPE_PLACEHOLDER, typeName)
  }

  /**
   * Checks whether a type should be handled as a plural. Typically used with {@link TemplateOptions.pluralIndicatorStr}.
   *
   * @param str - The type string to check.
   * @returns Whether the type is handled as a plural.
   */
  private isTypePlural(str: string | undefined): boolean {
    return str?.endsWith("[]") || false
  }

  /**
   * Tries to retrieve the summary template of a specified type from the {@link summaryKnowledgeBase}.
   *
   * @returns {string | undefined} The matching knowledge base template, if found.
   */
  tryToGetSummary({ str, ...options }: RetrieveOptions): string | undefined {
    const normalizedTypeStr = str.replaceAll("[]", "")
    return this.tryToFindInKnowledgeBase({
      ...options,
      str: normalizedTypeStr,
      knowledgeBase: this.summaryKnowledgeBase,
      templateOptions: {
        pluralIndicatorStr: str,
        ...options.templateOptions,
      },
    })
  }

  /**
   * Tries to retrieve the summary template of a function's symbol from the {@link functionSummaryKnowledgeBase}.
   *
   * @returns {string | undefined} The matching knowledge base template, if found.
   */
  tryToGetFunctionSummary({
    symbol,
    ...options
  }: RetrieveSymbolOptions): string | undefined {
    return this.tryToFindInKnowledgeBase({
      ...options,
      str: symbol.getName(),
      knowledgeBase: this.functionSummaryKnowledgeBase,
    })
  }

  /**
   * Tries to retrieve the return template of a function's symbol from the {@link functionReturnKnowledgeBase}.
   *
   * @returns {string | undefined} The matching knowledge base template, if found.
   */
  tryToGetFunctionReturns({
    symbol,
    ...options
  }: RetrieveSymbolOptions): string | undefined {
    return this.tryToFindInKnowledgeBase({
      ...options,
      str: symbol.getName(),
      knowledgeBase: this.functionReturnKnowledgeBase,
    })
  }

  /**
   * Tries to retrieve the description template of an OAS property from the {@link oasDescriptionKnowledgeBase}.
   *
   * @returns {string | undefined} The matching knowledgebase template, if found.
   */
  tryToGetOasDescription({
    str,
    ...options
  }: RetrieveOptions): string | undefined {
    const normalizedTypeStr = str.replaceAll("[]", "")
    return this.tryToFindInKnowledgeBase({
      ...options,
      str: normalizedTypeStr,
      knowledgeBase: this.oasDescriptionKnowledgeBase,
    })
  }
}

export default KnowledgeBaseFactory
