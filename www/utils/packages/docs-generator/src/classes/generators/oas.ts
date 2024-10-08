import { minimatch } from "minimatch"
import AbstractGenerator from "./index.js"
import ts from "typescript"
import OasKindGenerator from "../kinds/oas.js"
import { GeneratorEvent } from "../helpers/generator-event-manager.js"
import getBasePath from "../../utils/get-base-path.js"

/**
 * A class used to generate OAS yaml comments. The comments are written
 * in different files than the specified files.
 */
class OasGenerator extends AbstractGenerator {
  protected oasKindGenerator?: OasKindGenerator

  async run() {
    this.init()

    const { generateExamples } = this.options

    this.oasKindGenerator = new OasKindGenerator({
      checker: this.checker!,
      generatorEventManager: this.generatorEventManager,
      additionalOptions: {
        generateExamples,
      },
    })

    await Promise.all(
      this.program!.getSourceFiles().map(async (file) => {
        // Ignore .d.ts files
        if (file.isDeclarationFile || !this.isFileIncluded(file.fileName)) {
          return
        }
        const fileNodes: ts.Node[] = [file]

        console.log(`[OAS] Generating for ${file.fileName}...`)

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
            this.oasKindGenerator!.isAllowed(node) &&
            this.oasKindGenerator!.canDocumentNode(node)
          ) {
            const oas = await this.oasKindGenerator!.getDocBlock(node)

            if (!this.options.dryRun) {
              const filename =
                this.oasKindGenerator!.getAssociatedFileName(node)
              ts.sys.writeFile(
                filename,
                this.formatter.addCommentsToSourceFile(oas, "")
              )
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
      minimatch(getBasePath(fileName), "packages/medusa/**/api**/**", {
        matchBase: true,
      })
    )
  }
}

export default OasGenerator
