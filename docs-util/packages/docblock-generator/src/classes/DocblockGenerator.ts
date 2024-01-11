/* eslint-disable no-case-declarations */
import ts from "typescript"
import Formatter from "./Formatter.js"
import KindsRegistry from "./kinds/registry.js"

export type Options = {
  paths: string[]
  dryRun?: boolean
}

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

        const documentChild = (node: ts.Node, topLevel = false) => {
          const origNodeText = node.getFullText().trim()
          const nodeKindGenerator = this.kindsRegistry?.getKindGenerator(node)

          if (nodeKindGenerator && this.canDocumentNode(node)) {
            const docComment = nodeKindGenerator.getDocBlock(node)
            if (docComment.length) {
              ts.addSyntheticLeadingComment(
                node,
                ts.SyntaxKind.MultiLineCommentTrivia,
                docComment,
                true
              )
            }
          }

          ts.forEachChild(node, documentChild)

          if (topLevel) {
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

        ts.forEachChild(file, (node) => documentChild(node, true))

        if (!this.options.dryRun) {
          ts.sys.writeFile(
            file.fileName,
            await this.formatter.formatStr(fileContent, file.fileName)
          )
        }

        console.log(`Finished generating docblock for ${file.fileName}.`)
      })
    )

    this.reset()
  }

  isFileIncluded(fileName: string): boolean {
    return this.options.paths.some((path) => path.includes(fileName))
  }

  canDocumentNode(node: ts.Node): boolean {
    // check if node already has docblock
    // const symbol = getSymbol(node, this.checker!)
    const hasComments =
      ts.getLeadingCommentRanges(
        node.getSourceFile().getFullText(),
        node.getFullStart()
      ) !== undefined

    return !hasComments
  }

  reset() {
    this.program = undefined
    this.checker = undefined
  }
}

export default DocblockGenerator
