import ts from "typescript"
import DefaultKindGenerator, { GetDocBlockOptions } from "./default.js"
import getBasePath from "../../utils/get-base-path.js"
import { getDmlOutputBasePath } from "../../utils/get-output-base-paths.js"
import path from "path"
import { camelToWords, RELATION_NAMES, snakeToPascal } from "utils"
import toJsonFormatted from "../../utils/to-json-formatted.js"
import { DmlFile, DmlObject } from "types"

/**
 * DML generator for data models created with DML.
 */
class DmlKindGenerator extends DefaultKindGenerator<ts.CallExpression> {
  protected allowedKinds: ts.SyntaxKind[] = [ts.SyntaxKind.CallExpression]
  public name = "dml"

  /**
   * Checks whether the node is a call expression, is `model.define`, and has at least
   * two arguments.
   *
   * @param node - The node to check
   * @returns Whether this kind generator can be used for this node.
   */
  isAllowed(node: ts.Node): node is ts.CallExpression {
    if (!super.isAllowed(node)) {
      return false
    }

    const isModelUtility =
      "expression" in node.expression &&
      (node.expression.expression as ts.Node).getText() === "model"
    const isDefineMethod =
      "name" in node.expression &&
      (node.expression.name as ts.Identifier).getText() === "define"
    const hasAllArguments = node.arguments.length >= 2

    return isModelUtility && isDefineMethod && hasAllArguments
  }

  /**
   * Retrieve the DML object from the node's associated file, if it exists.
   *
   * @param node - The node to retrieve its DML object.
   * @param dataModelName - The data model's name
   * @returns The DML object, if available.
   */
  getExistingDmlObjectFromFile(
    node: ts.CallExpression,
    dataModelName: string
  ): DmlObject | undefined {
    const filePath = this.getAssociatedFileName(node)
    const existingJson = ts.sys.readFile(filePath)

    if (!existingJson) {
      return
    }

    const parsedJson = JSON.parse(existingJson) as DmlFile
    if (!Object.hasOwn(parsedJson, dataModelName)) {
      return
    }

    return parsedJson[dataModelName].properties
  }

  /**
   * Get new or updated JSON dml object of the data model.
   *
   * @param node - The node to get its JSON DML object.
   * @param options - General options
   * @returns The JSON dml object.
   */
  async getDocBlock(
    node: ts.CallExpression | ts.Node,
    options?: GetDocBlockOptions
  ): Promise<string> {
    if (!this.isAllowed(node)) {
      return await super.getDocBlock(node, options)
    }
    const dataModelName = this.getDataModelName(node.arguments[0])

    const existingDmlObject = this.getExistingDmlObjectFromFile(
      node,
      dataModelName
    )

    const properties = existingDmlObject
      ? this.updateExistingDmlObject({
          node,
          dmlObject: existingDmlObject,
          dataModelName,
        })
      : this.getNewDmlObject({
          node,
          dataModelName,
        })

    const dmlFile: DmlFile = {
      [dataModelName]: {
        filePath: getBasePath(node.getSourceFile().fileName),
        properties,
      },
    }

    return toJsonFormatted(dmlFile)
  }

  /**
   * Get a new DML object for a node.
   *
   * @param param0 - The node and data model's details
   * @returns The DML object.
   */
  getNewDmlObject({
    node,
    dataModelName,
  }: {
    node: ts.CallExpression
    dataModelName: string
  }): DmlObject {
    return this.getPropertiesFromNode(node, dataModelName)
  }

  /**
   * Update existing dml object by removing properties no longer
   * available and adding new ones.
   *
   * @param param0 - The node and data model's details.
   * @returns The updated DML object.
   */
  updateExistingDmlObject({
    node,
    dmlObject,
    dataModelName,
  }: {
    node: ts.CallExpression
    dmlObject: DmlObject
    dataModelName: string
  }): DmlObject {
    const newDmlObject = Object.assign({}, dmlObject)
    const newProperties = this.getPropertiesFromNode(node, dataModelName)

    const newPropertyNames = Object.keys(newProperties)
    const oldPropertyNames = Object.keys(newDmlObject)

    // delete properties not available anymore
    oldPropertyNames.forEach((oldPropertyName) => {
      if (!newPropertyNames.includes(oldPropertyName)) {
        delete newDmlObject[oldPropertyName]
      }
    })

    // add new properties
    newPropertyNames.forEach((newPropertyName) => {
      if (oldPropertyNames.includes(newPropertyName)) {
        return
      }

      newDmlObject[newPropertyName] = newProperties[newPropertyName]
    })

    return newDmlObject
  }

  /**
   * Get the data model's name. It's either a string passed to `model.define`, or
   * in the `name` property of the object passed as a parameter to `model.define`.
   *
   * @param node - The node to retrieve its data model name.
   * @returns The data model's name.
   */
  getDataModelName(node: ts.Node): string {
    let name = node.getText()
    if (ts.isObjectLiteralExpression(node)) {
      const nameProperty = node.properties.find((propertyNode) => {
        return (
          propertyNode.name?.getText() === "name" &&
          "initializer" in propertyNode
        )
      }) as ts.ObjectLiteralElementLike & {
        initializer: ts.Node
      }

      if (nameProperty) {
        name = nameProperty.initializer.getText()
      }
    }

    return snakeToPascal(name.replace(/^"/, "").replace(/"$/, ""))
  }

  /**
   * Get the properties of a node.
   *
   * @param node - The node to get its properties.
   * @param dataModelName - The data model's name.
   * @returns The properties and their description.
   */
  getPropertiesFromNode(
    node: ts.CallExpression,
    dataModelName: string
  ): DmlObject {
    const formattedDataModelName = this.formatDataModelName(dataModelName)
    const propertyNodes =
      "properties" in node.arguments[1]
        ? (node.arguments[1].properties as ts.Node[])
        : []

    const properties: DmlObject = {}

    propertyNodes.forEach((propertyNode) => {
      const propertyName =
        "name" in propertyNode
          ? (propertyNode.name as ts.Identifier).getText()
          : propertyNode.getText()
      const propertyType = this.checker.getTypeAtLocation(propertyNode)
      const propertyTypeStr = this.checker.typeToString(propertyType)

      const isRelation = RELATION_NAMES.some((relationName) =>
        propertyTypeStr.includes(relationName)
      )
      const isBoolean = propertyTypeStr.includes("BooleanProperty")
      const relationName = isRelation ? camelToWords(propertyName) : undefined

      let propertyDescription =
        this.knowledgeBaseFactory.tryToGetObjectPropertySummary({
          retrieveOptions: {
            str: propertyName,
            kind: propertyNode.kind,
            templateOptions: {
              parentName: formattedDataModelName,
              rawParentName: dataModelName,
            },
          },
          propertyDetails: {
            isClassOrInterface: isRelation,
            isBoolean,
            classOrInterfaceName: relationName,
          },
        })

      if (isRelation) {
        propertyDescription += `\n\n@expandable`
      }

      properties[propertyName] = propertyDescription
    })

    return properties
  }

  /**
   * Get the name of the output JSON file associated with a node.
   *
   * @param node - The node to get its file name.
   * @returns The file name.
   */
  getAssociatedFileName(node: ts.Node): string {
    const filePath = getBasePath(node.getSourceFile().fileName).split("/")
    // since modules are at packages/modules/<name>, the name should be at index 2
    const moduleName = filePath[2]

    return path.join(getDmlOutputBasePath(), `${moduleName}.json`)
  }

  /**
   * Format the data model name for presentation purposes.
   *
   * @param name - The raw data model's name.
   * @returns The formatted name.
   */
  formatDataModelName(name: string): string {
    return camelToWords(name)
  }
}

export default DmlKindGenerator
