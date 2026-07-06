import ts from "typescript"

/**
 * Builds an in-memory TypeScript program from a map of filename → source.
 * Returns the program, type checker, and a helper to look up a named type.
 */
export function createTestProgram(files: Record<string, string>): {
  program: ts.Program
  checker: ts.TypeChecker
  getType: (fileName: string, typeName: string) => ts.Type
} {
  const compilerHost = ts.createCompilerHost({})
  const originalGetSourceFile = compilerHost.getSourceFile.bind(compilerHost)

  compilerHost.getSourceFile = (fileName: string, languageVersion: ts.ScriptTarget) => {
    if (fileName in files) {
      return ts.createSourceFile(fileName, files[fileName], languageVersion, true)
    }
    return originalGetSourceFile(fileName, languageVersion)
  }

  compilerHost.fileExists = (fileName: string) =>
    fileName in files || ts.sys.fileExists(fileName)

  compilerHost.readFile = (fileName: string) =>
    files[fileName] ?? ts.sys.readFile(fileName)

  const program = ts.createProgram(Object.keys(files), {
    strict: true,
    target: ts.ScriptTarget.ES2020,
    moduleResolution: ts.ModuleResolutionKind.Node10,
  }, compilerHost)

  const checker = program.getTypeChecker()

  function getType(fileName: string, typeName: string): ts.Type {
    const sourceFile = program.getSourceFile(fileName)
    if (!sourceFile) throw new Error(`Source file not found: ${fileName}`)

    let found: ts.Type | undefined
    ts.forEachChild(sourceFile, (node) => {
      if (found) return
      if (
        (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
        node.name.text === typeName
      ) {
        const symbol = checker.getSymbolAtLocation(node.name)
        if (symbol) found = checker.getDeclaredTypeOfSymbol(symbol)
      }
    })

    if (!found) throw new Error(`Type '${typeName}' not found in '${fileName}'`)
    return found
  }

  return { program, checker, getType }
}

/**
 * Convenience wrapper around `createTestProgram` for tests that only need a
 * single in-memory source file. The file is always named `"input.ts"`.
 *
 * Returns the checker and a `getType(typeName)` helper that omits the file name.
 */
export function createSingleFileProgram(source: string): {
  program: ts.Program
  checker: ts.TypeChecker
  getType: (typeName: string) => ts.Type
} {
  const fileName = "input.ts"
  const { program, checker, getType: getTypeMulti } = createTestProgram({ [fileName]: source })
  return {
    program,
    checker,
    getType: (typeName: string) => getTypeMulti(fileName, typeName),
  }
}
