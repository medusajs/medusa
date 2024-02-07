/* eslint-disable no-case-declarations */
import ts from "typescript"
import { GeneratorEvent } from "../helpers/generator-event-manager.js"
import AbstractGenerator from "./index.js"
import { minimatch } from "minimatch"

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

    await Promise.all(
      this.program!.getSourceFiles().map(async (file) => {
        // Ignore .d.ts files
        if (file.isDeclarationFile || !this.isFileIncluded(file.fileName)) {
          return
        }

        console.log(`[Docblock] Generating for ${file.fileName}...`)

        let fileContent = file.getFullText()
        let fileComments: string = ""
        const commentsToRemove: string[] = []

        const documentChild = (node: ts.Node, topLevel = false) => {
          const isSourceFile = ts.isSourceFile(node)
          const origNodeText = node.getFullText().trim()
          const nodeKindGenerator = this.kindsRegistry?.getKindGenerator(node)
          let docComment: string | undefined

          if (nodeKindGenerator?.canDocumentNode(node)) {
            docComment = nodeKindGenerator.getDocBlock(node)
            if (docComment.length) {
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

          ts.forEachChild(node, (childNode) =>
            documentChild(childNode, isSourceFile)
          )

          if (!isSourceFile && topLevel) {
            const newNodeText = printer.printNode(
              ts.EmitHint.Unspecified,
              node,
              file
            )

            if (newNodeText !== origNodeText) {
              fileContent = fileContent.replace(origNodeText, newNodeText)
            }
          }
        }

        documentChild(file, true)

        if (!this.options.dryRun) {
          commentsToRemove.forEach((commentToRemove) => {
            fileContent = fileContent.replace(commentToRemove, "")
          })
          ts.sys.writeFile(
            file.fileName,
            this.formatter.addCommentsToSourceFile(
              fileComments,
              await this.formatter.formatStr(fileContent, file.fileName)
            )
          )
        }

        console.log(
          `[Docblock] Finished generating docblock for ${file.fileName}.`
        )
      })
    )

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
      !minimatch(fileName, "**/packages/medusa/**/api**/**", {
        matchBase: true,
      })
    )
  }
}

export default DocblockGenerator
