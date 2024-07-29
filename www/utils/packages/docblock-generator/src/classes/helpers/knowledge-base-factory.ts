import ts from "typescript"
import {
  API_ROUTE_PARAM_REGEX,
  DOCBLOCK_DOUBLE_LINES,
  DOCBLOCK_NEW_LINE,
  SUMMARY_PLACEHOLDER,
} from "../../constants.js"
import pluralize from "pluralize"
import {
  camelToTitle,
  camelToWords,
  kebabToTitle,
  snakeToWords,
  wordsToKebab,
} from "utils"
import { normalizeName } from "../../utils/str-formatting.js"

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
  tryToGetOasSchemaDescription({
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
  /**
   * Retrieve the summary and description of the OAS.
   *
   * @param param0 - The OAS operation's details.
   * @returns The summary and description.
   */
  tryToGetOasMethodSummaryAndDescription({
    oasPath,
    httpMethod,
    tag,
  }: {
    /**
     * The OAS path.
     */
    oasPath: string
    /**
     * The HTTP method name.
     */
    httpMethod: string
    /**
     * The OAS tag name.
     */
    tag: string
  }): {
    /**
     * The OAS's summary
     */
    summary: string
    /**
     * The OAS's description.
     */
    description: string
  } {
    // reset regex manually
    API_ROUTE_PARAM_REGEX.lastIndex = 0
    const result = {
      summary: SUMMARY_PLACEHOLDER,
      description: SUMMARY_PLACEHOLDER,
    }
    // retrieve different variations of the tag to include in the summary/description
    const lowerTag = tag.toLowerCase()
    const singularLowerTag = pluralize.singular(lowerTag)
    const singularTag = pluralize.singular(tag)

    // check if the OAS operation is performed on a single entity or
    // general entities. If the operation has a path parameter, then it's
    // considered for a single entity.
    const isForSingleEntity = API_ROUTE_PARAM_REGEX.test(oasPath)

    if (isForSingleEntity) {
      // Check whether the OAS operation is applied on a different entity.
      // If the OAS path ends with /batch or a different entity
      // name than the tag name, then it's performed on an entity other than the
      // main entity (the one indicated by the tag), so the summary/description vary
      // slightly.
      const splitOasPath = oasPath
        .replaceAll(API_ROUTE_PARAM_REGEX, "")
        .replace(/\/(batch)*$/, "")
        .split("/")
      const isBulk = oasPath.endsWith("/batch")
      const isOperationOnDifferentEntity =
        wordsToKebab(tag) !== splitOasPath[splitOasPath.length - 1]

      if (isBulk || isOperationOnDifferentEntity) {
        // if the operation is a bulk operation and it ends with a path parameter (after removing the `/batch` part)
        // then the tag name is the targeted entity. Else, it's the last part of the OAS path (after removing the `/batch` part).
        const endingEntityName =
          isBulk &&
          API_ROUTE_PARAM_REGEX.test(splitOasPath[splitOasPath.length - 1])
            ? tag
            : kebabToTitle(splitOasPath[splitOasPath.length - 1])
        // retrieve different formatted versions of the entity name for the summary/description
        const pluralEndingEntityName = pluralize.plural(endingEntityName)
        const lowerEndingEntityName = pluralEndingEntityName.toLowerCase()
        const singularLowerEndingEntityName =
          pluralize.singular(endingEntityName)

        // set the summary/description based on the HTTP method
        if (httpMethod === "get") {
          result.summary = `List ${pluralEndingEntityName}`
          result.description = `Retrieve a list of ${lowerEndingEntityName} in a ${singularLowerTag}. The ${lowerEndingEntityName} can be filtered by fields like FILTER FIELDS. The ${lowerEndingEntityName} can also be paginated.`
        } else if (httpMethod === "post") {
          result.summary = `Add ${pluralEndingEntityName} to ${singularTag}`
          result.description = `Add a list of ${lowerEndingEntityName} to a ${singularLowerTag}.`
        } else {
          result.summary = `Remove ${pluralEndingEntityName} from ${singularTag}`
          result.description = `Remove a list of ${lowerEndingEntityName} from a ${singularLowerTag}. This doesn't delete the ${singularLowerEndingEntityName}, only the association between the ${singularLowerEndingEntityName} and the ${singularLowerTag}.`
        }
      } else {
        // the OAS operation is applied on a single entity that is the main entity (denoted by the tag).
        // retrieve the summary/description based on the HTTP method.
        if (httpMethod === "get") {
          result.summary = `Get a ${singularTag}`
          result.description = `Retrieve a ${singularLowerTag} by its ID. You can expand the ${singularLowerTag}'s relations or select the fields that should be returned.`
        } else if (httpMethod === "post") {
          result.summary = `Update a ${singularTag}`
          result.description = `Update a ${singularLowerTag}'s details.`
        } else {
          result.summary = `Delete a ${singularTag}`
          result.description = `Delete a ${singularLowerTag}.`
        }
      }
    } else {
      // the OAS operation is applied on all entities of the tag in general.
      // retrieve the summary/description based on the HTTP method.
      if (httpMethod === "get") {
        result.summary = `List ${tag}`
        result.description = `Retrieve a list of ${lowerTag}. The ${lowerTag} can be filtered by fields such as \`id\`. The ${lowerTag} can also be sorted or paginated.`
      } else if (httpMethod === "post") {
        result.summary = `Create ${singularTag}`
        result.description = `Create a ${singularLowerTag}.`
      } else {
        result.summary = `Delete ${tag}`
        result.description = `Delete ${tag}`
      }
    }

    return result
  }

  /**
   * Retrieve summary and description for a property of an object, interface, or type.
   *
   * @param param0 - The property's details.
   * @returns The property's summary.
   */
  tryToGetObjectPropertySummary({
    retrieveOptions,
    propertyDetails: { isClassOrInterface, isBoolean, classOrInterfaceName },
  }: {
    /**
     * The options used to retrieve the summary from the knowledge base, if available.
     */
    retrieveOptions: RetrieveOptions
    /**
     * The details of the property.
     */
    propertyDetails: {
      /**
       * Whether the property's value is a class or interface. This applies to all
       * object-like types.
       *
       * If `true`, the property is considered to represent a relationship to another
       * class / interface.
       */
      isClassOrInterface: boolean
      /**
       * Whether the property's value is a boolean
       */
      isBoolean: boolean
      /**
       * The name of the class / interface this property's value is associated to.
       * This is only used if {@link isClassOrInterface} is `true`.
       */
      classOrInterfaceName?: string
    }
  }): string {
    let summary = this.tryToGetSummary(retrieveOptions)

    if (summary) {
      return summary
    }

    if (isClassOrInterface) {
      summary = `The associated ${classOrInterfaceName}.`
    } else if (isBoolean) {
      summary = `Whether the ${retrieveOptions.templateOptions
        ?.parentName} ${snakeToWords(retrieveOptions.str)}.`
    } else {
      summary = `The ${snakeToWords(
        retrieveOptions.str
      )} of the ${retrieveOptions.templateOptions?.parentName}`
    }

    return summary
  }
}

export default KnowledgeBaseFactory
