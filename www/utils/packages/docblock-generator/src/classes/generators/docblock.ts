/* eslint-disable no-case-declarations */
import ts from "typescript"
import { GeneratorEvent } from "../helpers/generator-event-manager.js"
import AbstractGenerator from "./index.js"
import { minimatch } from "minimatch"
import AiGenerator from "../helpers/ai-generator.js"

/**
 * A class used to generate docblock for one or multiple file paths.
 */
class DocblockGenerator extends AbstractGenerator {
  /**
   * Generate docblocks for the files in the `options`.
   */
  async run() {
    this.init()

    const printer = ts.createPrinter({
      removeComments: false,
    })

    const documentSourceFile = async (file: ts.SourceFile) => {
      // Ignore .d.ts files
      if (file.isDeclarationFile || !this.isFileIncluded(file.fileName)) {
        return
      }
      let aiGenerator: AiGenerator | undefined

      console.log(`[Docblock] Generating for ${file.fileName}...`)

      let fileContent = file.getFullText()
      let fileComments: string = ""
      const commentsToRemove: string[] = []
      const origFileText = file.getFullText().trim()
      const fileNodes: ts.Node[] = [file]

      if (this.options.generateExamples) {
        aiGenerator = new AiGenerator()
      }

      // since typescript's compiler API doesn't support
      // async processes, we have to retrieve the nodes first then
      // traverse them separately.
      const pushNodesToArr = (node: ts.Node) => {
        fileNodes.push(node)

        ts.forEachChild(node, pushNodesToArr)
      }
      ts.forEachChild(file, pushNodesToArr)

      const documentNode = async (node: ts.Node) => {
        const isSourceFile = ts.isSourceFile(node)
        const nodeKindGenerator = this.kindsRegistry?.getKindGenerator(node)
        let docComment: string | undefined

        if (nodeKindGenerator?.canDocumentNode(node)) {
          if (aiGenerator) {
            const nodeFiles = aiGenerator.getNodeFiles(file)
            await aiGenerator.initAssistant(nodeFiles)
          }
          // initialize assistant only when needed
          // if previously initialized, calling the method does nothing
          docComment = await nodeKindGenerator.getDocBlock(node, {
            aiGenerator,
            addEnd: true,
          })
          if (docComment.length) {
            const existingComments =
              nodeKindGenerator.getNodeCommentsFromRange(node)
            if (existingComments?.length) {
              commentsToRemove.push(existingComments)
            }
            if (isSourceFile) {
              fileComments = docComment
            } else {
              ts.addSyntheticLeadingComment(
                node,
                ts.SyntaxKind.MultiLineCommentTrivia,
                docComment,
                true
              )
            }
          }
        }
      }

      // due to rate limit being reached when running
      // the AI Generator, we only run the documentNode in
      // parallel when the `generateExamples` option is disabled.
      if (this.options.generateExamples) {
        for (const node of fileNodes) {
          await documentNode(node)
        }
      } else {
        await Promise.all(
          fileNodes.map(async (node) => await documentNode(node))
        )
      }

      if (aiGenerator) {
        await aiGenerator.destroyAssistant()
      }

      // add comments to file
      const newNodeText = printer.printNode(ts.EmitHint.Unspecified, file, file)

      // if file's text changed, replace it.
      if (newNodeText !== origFileText) {
        fileContent = fileContent.replace(origFileText, newNodeText)
      }

      if (!this.options.dryRun) {
        if (commentsToRemove.length) {
          let formatted = this.formatter.addCommentsToSourceFile(
            fileComments,
            await this.formatter.formatStr(fileContent, file.fileName)
          )
          commentsToRemove.forEach((commentToRemove) => {
            formatted = formatted.replace(commentToRemove, "")
          })
          ts.sys.writeFile(
            file.fileName,
            await this.formatter.formatStr(formatted, file.fileName)
          )
        } else {
          ts.sys.writeFile(
            file.fileName,
            this.formatter.addCommentsToSourceFile(
              fileComments,
              await this.formatter.formatStr(fileContent, file.fileName)
            )
          )
        }
      }

      console.log(
        `[Docblock] Finished generating docblock for ${file.fileName}.`
      )
    }

    if (this.options.generateExamples) {
      for (const file of this.program!.getSourceFiles()) {
        await documentSourceFile(file)
      }
    } else {
      await Promise.all(
        this.program!.getSourceFiles().map(
          async (file) => await documentSourceFile(file)
        )
      )
    }

    this.generatorEventManager.emit(GeneratorEvent.FINISHED_GENERATE_EVENT)
    this.reset()
  }

  /**
   * Checks whether the specified file path is included in the program
   * and isn't an API file.
   *
   * @param fileName - The file path to check
   * @returns Whether the docblock generator can run on this file.
   */
  isFileIncluded(fileName: string): boolean {
    return (
      super.isFileIncluded(fileName) &&
      !minimatch(this.getBasePath(fileName), "packages/medusa/**/api**/**", {
        matchBase: true,
      })
    )
  }
}

export default DocblockGenerator
