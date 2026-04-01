import ts from "typescript"
import path from "path"
import { getMonorepoRoot } from "../utils/fs-helpers"

export interface ProgramContext {
  program: ts.Program
  checker: ts.TypeChecker
}

/**
 * Reads and parses the monorepo base TypeScript compiler options from
 * `_tsconfig.base.json`. This ensures module resolution, paths, and other
 * settings match the rest of the monorepo.
 */
function getBaseCompilerOptions(): ts.CompilerOptions {
  const monorepoRoot = getMonorepoRoot()
  const tsconfigBasePath = path.join(monorepoRoot, "_tsconfig.base.json")

  const configStr = ts.sys.readFile(tsconfigBasePath)
  if (!configStr) {
    console.warn(
      `Warning: could not read ${tsconfigBasePath}, using default compiler options`
    )
    return {
      target: ts.ScriptTarget.ES2021,
      module: ts.ModuleKind.Node16,
      moduleResolution: ts.ModuleResolutionKind.Node16,
      esModuleInterop: true,
      skipLibCheck: true,
      strictNullChecks: true,
      resolveJsonModule: true,
      allowJs: true,
    }
  }

  const parsed = ts.parseJsonConfigFileContent(
    JSON.parse(configStr),
    ts.sys,
    monorepoRoot
  )

  return {
    ...parsed.options,
    // Disable emit since we're only doing analysis
    noEmit: true,
    // Ensure we get full type information
    skipLibCheck: true,
  }
}

/**
 * Creates a TypeScript program and type checker from a list of source files.
 * All files are included in a single program to share one TypeChecker instance,
 * which is the most expensive part of TypeScript compilation.
 *
 * @param rootFiles - Absolute paths to all files to include as root files.
 *   Typically these are the validator files plus any HTTP type files for validation.
 * @param virtualFiles - Optional in-memory files (filename → content) for
 *   validation assertions without writing to disk.
 */
export function createProgramContext(
  rootFiles: string[],
  virtualFiles?: Map<string, string>
): ProgramContext {
  const compilerOptions = getBaseCompilerOptions()

  let program: ts.Program

  if (virtualFiles && virtualFiles.size > 0) {
    // Use a custom CompilerHost to serve in-memory virtual files
    const defaultHost = ts.createCompilerHost(compilerOptions)

    const customHost: ts.CompilerHost = {
      ...defaultHost,
      getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile) {
        if (virtualFiles.has(fileName)) {
          return ts.createSourceFile(
            fileName,
            virtualFiles.get(fileName)!,
            languageVersion
          )
        }
        return defaultHost.getSourceFile(
          fileName,
          languageVersion,
          onError,
          shouldCreateNewSourceFile
        )
      },
      fileExists(fileName) {
        return virtualFiles.has(fileName) || defaultHost.fileExists(fileName)
      },
      readFile(fileName) {
        return virtualFiles.get(fileName) ?? defaultHost.readFile(fileName)
      },
    }

    const allFiles = [...rootFiles, ...virtualFiles.keys()]
    program = ts.createProgram(allFiles, compilerOptions, customHost)
  } else {
    program = ts.createProgram(rootFiles, compilerOptions)
  }

  const checker = program.getTypeChecker()
  return { program, checker }
}
