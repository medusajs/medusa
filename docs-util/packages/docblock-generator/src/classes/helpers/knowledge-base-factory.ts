import ts from "typescript"
import { DOCBLOCK_NEW_LINE } from "../../constants.js"
import {
  camelToTitle,
  camelToWords,
  normalizeName,
  snakeToWords,
} from "../../utils/str-formatting.js"
import pluralize from "pluralize"

type TemplateOptions = {
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
            : `{type name}`
        return `The configurations determining how the ${typeName} is retrieved. Its properties, such as \`select\` or \`relations\`, accept the ${DOCBLOCK_NEW_LINE}attributes or relations associated with a ${typeName}.`
      },
    },
    {
      startsWith: "Filterable",
      endsWith: "Props",
      template: (str) => {
        return `The filters to apply on the retrieved ${camelToTitle(
          normalizeName(str)
        )}.`
      },
    },
    {
      startsWith: "Create",
      endsWith: "DTO",
      template: (str) => {
        return `The ${camelToTitle(normalizeName(str))} to be created.`
      },
    },
    {
      startsWith: "Update",
      endsWith: "DTO",
      template: (str) => {
        return `The attributes to update in the ${camelToTitle(
          normalizeName(str)
        )}.`
      },
    },
    {
      startsWith: "RestoreReturn",
      template: `Configurations determining which relations to restore along with each of the {type name}. You can pass to its \`returnLinkableKeys\` ${DOCBLOCK_NEW_LINE}property any of the {type name}'s relation attribute names, such as \`{type relation name}\`.`,
    },
    {
      endsWith: "DTO",
      template: (str: string): string => {
        return `The ${camelToTitle(normalizeName(str))} details.`
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
          return `The IDs to filter the ${options?.parentName || `{name}`} by.`
        }
        return `The ID of the ${options?.parentName || `{name}`}.`
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
  ]
  private functionSummaryKnowledgeBase: KnowledgeBase[] = [
    {
      startsWith: "listAndCount",
      template:
        "retrieves a paginated list of {return type} along with the total count of available {return type}(s) satisfying the provided filters.",
    },
    {
      startsWith: "list",
      template:
        "retrieves a paginated list of {return type}(s) based on optional filters and configuration.",
    },
    {
      startsWith: "retrieve",
      template: "retrieves a {return type} by its ID.",
    },
    {
      startsWith: "create",
      template: "creates {return type}(s)",
    },
    {
      startsWith: "delete",
      template: "deletes {return type} by its ID.",
    },
    {
      startsWith: "update",
      template: "updates existing {return type}(s).",
    },
    {
      startsWith: "softDelete",
      template: "soft deletes {return type}(s) by their IDs.",
    },
    {
      startsWith: "restore",
      template: "restores soft deleted {return type}(s) by their IDs.",
    },
  ]
  private functionReturnKnowledgeBase: KnowledgeBase[] = [
    {
      startsWith: "listAndCount",
      template: "The list of {return type}(s) along with their total count.",
    },
    {
      startsWith: "list",
      template: "The list of {return type}(s).",
    },
    {
      startsWith: "retrieve",
      template: "The retrieved {return type}(s).",
    },
    {
      startsWith: "create",
      template: "The created {return type}(s).",
    },
    {
      startsWith: "update",
      template: "The updated {return type}(s).",
    },
    {
      startsWith: "restore",
      template: `An object that includes the IDs of related records that were restored, such as the ID of associated {relation name}. ${DOCBLOCK_NEW_LINE}The object's keys are the ID attribute names of the {type name} entity's relations, such as \`{relation ID field name}\`, ${DOCBLOCK_NEW_LINE}and its value is an array of strings, each being the ID of the record associated with the money amount through this relation, ${DOCBLOCK_NEW_LINE}such as the IDs of associated {relation name}.`,
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
