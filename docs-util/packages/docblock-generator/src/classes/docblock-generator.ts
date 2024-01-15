/* eslint-disable no-case-declarations */
import ts from "typescript"
import Formatter from "./formatter.js"
import KindsRegistry from "./kinds/registry.js"
import nodeHasComments from "../utils/node-has-comments.js"

export type Options = {
  paths: string[]
  dryRun?: boolean
}

/**
 * A class used to generate docblock for one or multiple file paths.
 */
class DocblockGenerator {
  protected options: Options
  protected program?: ts.Program
  protected checker?: ts.TypeChecker
  protected formatter: Formatter
  protected kindsRegistry?: KindsRegistry

  constructor(options: Options) {
    this.options = options
    this.formatter = new Formatter()
  }

  /**
   * Generate the docblock for the paths specified in the {@link options} class property.
   */
  async run() {
    this.program = ts.createProgram(this.options.paths, {})

    this.checker = this.program.getTypeChecker()

    this.kindsRegistry = new KindsRegistry(this.checker)

    const printer = ts.createPrinter({
      removeComments: false,
    })

    await Promise.all(
      this.program.getSourceFiles().map(async (file) => {
        // Ignore .d.ts files
        if (file.isDeclarationFile || !this.isFileIncluded(file.fileName)) {
          return
        }

        console.log(`Generating for ${file.fileName}...`)

        let fileContent = file.getFullText()
        let fileComments: string = ""

        const documentChild = (node: ts.Node, topLevel = false) => {
          const isSourceFile = ts.isSourceFile(node)
          const origNodeText = node.getFullText().trim()
          const nodeKindGenerator = this.kindsRegistry?.getKindGenerator(node)
          let docComment: string | undefined

          if (nodeKindGenerator && this.canDocumentNode(node)) {
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
          ts.sys.writeFile(
            file.fileName,
            this.formatter.addCommentsToSourceFile(
              fileComments,
              await this.formatter.formatStr(fileContent, file.fileName)
            )
          )
        }

        console.log(`Finished generating docblock for ${file.fileName}.`)
      })
    )

    this.reset()
  }

  /**
   * Checks whether a file is included in the specified files.
   *
   * @param {string} fileName - The file to check for.
   * @returns {boolean} Whether the file can have docblocks generated for it.
   */
  isFileIncluded(fileName: string): boolean {
    return this.options.paths.some((path) => path.includes(fileName))
  }

  /**
   * Checks whether a node can be documented.
   *
   * @privateRemark
   * I'm leaving this method in case other conditions arise for a node to be documented.
   * Otherwise, we can directly use the {@link nodeHasComments} function.
   *
   * @param {ts.Node} node - The node to check for.
   * @returns {boolean} Whether the node can be documented.
   */
  canDocumentNode(node: ts.Node): boolean {
    // check if node already has docblock
    return !nodeHasComments(node)
  }

  /**
   * Reset the generator's properties for new usage.
   */
  reset() {
    this.program = undefined
    this.checker = undefined
  }
}

export default DocblockGenerator
