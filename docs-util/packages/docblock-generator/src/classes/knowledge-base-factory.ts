import ts from "typescript"
import { DOCBLOCK_DOUBLE_LINES, DOCBLOCK_NEW_LINE } from "../constants.js"

type KnowledgeBase = {
  startsWith: string
  endsWith?: string
  value: string
}

/**
 * A class that holds common Medusa patterns and acts as a knowledge base for possible summaries/examples/general templates.
 */
class KnowledgeBaseFactory {
  private summaryKnowledgeBase: KnowledgeBase[] = [
    {
      startsWith: "FindConfig",
      value: `The configurations determining how the {type name} is retrieved. Its properties, such as \`select\` or \`relations\`, accept the ${DOCBLOCK_NEW_LINE}attributes or relations associated with a {item name}.`,
    },
    {
      startsWith: "Filterable",
      value: "The filters to apply on the retrieved {type name}.",
    },
    {
      startsWith: "Create",
      endsWith: "DTO",
      value: "The {type name} to be created.",
    },
    {
      startsWith: "Update",
      endsWith: "DTO",
      value: "The attributes to update in the {type name}.",
    },
    {
      startsWith: "RestoreReturn",
      value: `Configurations determining which relations to restore along with each of the {type name}. You can pass to its \`returnLinkableKeys\` ${DOCBLOCK_NEW_LINE}property any of the {type name}'s relation attribute names, such as \`{type relation name}\`.`,
    },
  ]
  private functionSummaryKnowledgeBase: KnowledgeBase[] = [
    {
      startsWith: "listAndCount",
      value:
        "retrieves a paginated list of {type name} along with the total count of available {type name} satisfying the provided filters.",
    },
    {
      startsWith: "list",
      value:
        "retrieves a paginated list of {type name} based on optional filters and configuration.",
    },
    {
      startsWith: "retrieve",
      value: "retrieves a {type name} by its ID.",
    },
    {
      startsWith: "create",
      value: "creates a new {type name}",
    },
    {
      startsWith: "delete",
      value: "deletes {type name} by its ID.",
    },
    {
      startsWith: "update",
      value: "updates existing {type name}.",
    },
    {
      startsWith: "softDelete",
      value: "soft deletes {type name} by their IDs.",
    },
    {
      startsWith: "restore",
      value: "restores soft deleted {type name} by their IDs.",
    },
  ]
  private exampleCodeBlockLine = `${DOCBLOCK_DOUBLE_LINES}\`\`\`ts${DOCBLOCK_NEW_LINE}{example-code}${DOCBLOCK_NEW_LINE}\`\`\`${DOCBLOCK_DOUBLE_LINES}`
  private examplesKnowledgeBase: KnowledgeBase[] = [
    {
      startsWith: "list",
      value: `To retrieve a list of prices sets using their IDs: ${this.exampleCodeBlockLine} To specify relations that should be retrieved within the price sets: ${this.exampleCodeBlockLine} By default, only the first \`{default limit}\` records are retrieved. You can control pagination by specifying the \`skip\` and \`take\` properties of the \`config\` parameter: ${this.exampleCodeBlockLine}`,
    },
    {
      startsWith: "retrieve",
      value: `A simple example that retrieves a price set by its ID: ${this.exampleCodeBlockLine} To specify relations that should be retrieved: ${this.exampleCodeBlockLine}`,
    },
  ]
  private functionReturnKnowledgeBase: KnowledgeBase[] = [
    {
      startsWith: "listAndCount",
      value: "The list of {type name} along with their total count.",
    },
    {
      startsWith: "list",
      value: "The list of {type name}.",
    },
    {
      startsWith: "retrieve",
      value: "The retrieved {type name}.",
    },
    {
      startsWith: "create",
      value: "The created {type name}.",
    },
    {
      startsWith: "update",
      value: "The updated {type name}.",
    },
    {
      startsWith: "restore",
      value: `An object that includes the IDs of related records that were restored, such as the ID of associated {relation name}. ${DOCBLOCK_NEW_LINE}The object's keys are the ID attribute names of the {type name} entity's relations, such as \`{relation ID field name}\`, ${DOCBLOCK_NEW_LINE}and its value is an array of strings, each being the ID of the record associated with the money amount through this relation, ${DOCBLOCK_NEW_LINE}such as the IDs of associated {relation name}.`,
    },
  ]

  /**
   * Tries to find in a specified knowledge base a template relevant to the specified name.
   *
   * @param {string} str - A name that can be of a function, type, etc...
   * @param {KnowledgeBase[]} knowledgeBase - A knowledge base to search in.
   * @returns {string | undefined} The matching knowledge base template, if found.
   */
  tryToFindInKnowledgeBase(
    str: string,
    knowledgeBase: KnowledgeBase[]
  ): string | undefined {
    return knowledgeBase.find(
      (item) =>
        str.startsWith(item.startsWith) &&
        (!item.endsWith || str.endsWith(item.endsWith))
    )?.value
  }

  /**
   * Tries to retrieve the summary template of a specified type from the {@link summaryKnowledgeBase}.
   *
   * @param {string} typeStr - The name of the type to retrieve its summary.
   * @returns {string | undefined} The matching knowledge base template, if found.
   */
  tryToGetSummary(typeStr: string): string | undefined {
    const normalizedTypeStr = typeStr.replaceAll("[]", "")
    return this.tryToFindInKnowledgeBase(
      normalizedTypeStr,
      this.summaryKnowledgeBase
    )
  }

  /**
   * Tries to retrieve the summary template of a function's symbol from the {@link functionSummaryKnowledgeBase}.
   *
   * @param {ts.Symbol} symbol - The symbol of the function to retrieve its summary template.
   * @returns {string | undefined} The matching knowledge base template, if found.
   */
  tryToGetFunctionSummary(symbol: ts.Symbol): string | undefined {
    return this.tryToFindInKnowledgeBase(
      symbol.getName(),
      this.functionSummaryKnowledgeBase
    )
  }

  /**
   * Tries to retrieve the example template of a function's symbol from the {@link examplesKnowledgeBase}.
   *
   * @param {ts.Symbol} symbol - The symbol of the function to retrieve its example template.
   * @returns {string | undefined} The matching knowledge base template, if found.
   */
  tryToGetFunctionExamples(symbol: ts.Symbol): string | undefined {
    return this.tryToFindInKnowledgeBase(
      symbol.getName(),
      this.examplesKnowledgeBase
    )
  }

  /**
   * Tries to retrieve the return template of a function's symbol from the {@link functionReturnKnowledgeBase}.
   *
   * @param {ts.Symbol} symbol - The symbol of the function to retrieve its return template.
   * @returns {string | undefined} The matching knowledge base template, if found.
   */
  tryToGetFunctionReturns(symbol: ts.Symbol): string | undefined {
    return this.tryToFindInKnowledgeBase(
      symbol.getName(),
      this.functionReturnKnowledgeBase
    )
  }
}

export default KnowledgeBaseFactory
