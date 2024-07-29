import ts from "typescript"
import DmlKindGenerator from "../kinds/dml.js"
import AbstractGenerator from "./index.js"
import { GeneratorEvent } from "../helpers/generator-event-manager.js"
import { minimatch } from "minimatch"
import getBasePath from "../../utils/get-base-path.js"
import toJsonFormatted from "../../utils/to-json-formatted.js"
import { DmlFile } from "../../types/index.js"

/**
 * A class used to generate DML JSON files with descriptions of properties.
 */
class DmlGenerator extends AbstractGenerator {
  protected dmlKindGenerator?: DmlKindGenerator

  async run() {
    this.init()

    this.dmlKindGenerator = new DmlKindGenerator({
      checker: this.checker!,
      generatorEventManager: this.generatorEventManager,
    })

    await Promise.all(
      this.program!.getSourceFiles().map(async (file) => {
        // Ignore .d.ts files
        if (file.isDeclarationFile || !this.isFileIncluded(file.fileName)) {
          return
        }
        const fileNodes: ts.Node[] = [file]

        console.log(`[DML] Generating for ${file.fileName}...`)

        // since typescript's compiler API doesn't support
        // async processes, we have to retrieve the nodes first then
        // traverse them separately.
        const pushNodesToArr = (node: ts.Node) => {
          fileNodes.push(node)

          ts.forEachChild(node, pushNodesToArr)
        }
        ts.forEachChild(file, pushNodesToArr)

        const documentChild = async (node: ts.Node) => {
          if (
            this.dmlKindGenerator!.isAllowed(node) &&
            this.dmlKindGenerator!.canDocumentNode(node)
          ) {
            const dmlJson = await this.dmlKindGenerator!.getDocBlock(node)

            if (!this.options.dryRun) {
              const filePath =
                this.dmlKindGenerator!.getAssociatedFileName(node)
              this.writeJson(filePath, dmlJson)
            }
          }
        }

        await Promise.all(
          fileNodes.map(async (node) => await documentChild(node))
        )

        this.generatorEventManager.emit(GeneratorEvent.FINISHED_GENERATE_EVENT)
        console.log(`[OAS] Finished generating OAS for ${file.fileName}.`)
      })
    )
  }

  /**
   * Checks whether the specified file path is included in the program
   * and is an API file.
   *
   * @param fileName - The file path to check
   * @returns Whether the OAS generator can run on this file.
   */
  isFileIncluded(fileName: string): boolean {
    return (
      super.isFileIncluded(fileName) &&
      minimatch(getBasePath(fileName), "packages/modules/**/models/**", {
        matchBase: true,
      })
    )
  }

  /**
   * This method writes the DML JSON file. If the file already exists, it only updates
   * the data model's object in the JSON file.
   *
   * @param filePath - The path of the file to write the DML JSON to.
   * @param dataModelJson - The DML JSON.
   */
  writeJson(filePath: string, dataModelJson: string) {
    let moduleJson = ts.sys.readFile(filePath)
    if (!moduleJson) {
      moduleJson = dataModelJson
    } else {
      // parse the JSON and replace the data model's JSON
      // with the new one
      const parsedModuleJson = JSON.parse(moduleJson) as DmlFile
      const parsedDataModelJson = JSON.parse(dataModelJson) as DmlFile
      const dataModelName = Object.keys(parsedDataModelJson)[0]
      parsedModuleJson[dataModelName] = parsedDataModelJson[dataModelName]

      moduleJson = toJsonFormatted(parsedModuleJson)
    }

    ts.sys.writeFile(filePath, moduleJson)
  }
}

export default DmlGenerator
