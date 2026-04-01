import ts from "typescript"
import path from "path"
import { FsHelpers } from "../utils/fs-helpers"
import { Config } from "../config"

export interface ProgramContext {
  program: ts.Program
  checker: ts.TypeChecker
}

export class ProgramFactory {
  /**
   * Reads and parses the project's TypeScript compiler options from the
   * tsconfig file specified in config (defaults to `tsconfig.json`).
   */
  private static getBaseCompilerOptions(): ts.CompilerOptions {
    const projectRoot = FsHelpers.getProjectRoot()
    const tsconfigBasePath = path.join(projectRoot, Config.get().tsconfig)

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
      projectRoot
    )

    return {
      ...parsed.options,
      noEmit: true,
      skipLibCheck: true,
    }
  }

  /**
   * Creates a TypeScript program and type checker from a list of source files.
   * All files are included in a single program to share one TypeChecker instance,
   * which is the most expensive part of TypeScript compilation.
   *
   * @param rootFiles - Absolute paths to all files to include as root files.
   * @param virtualFiles - Optional in-memory files (filename → content) for
   *   validation assertions without writing to disk.
   */
  static create(
    rootFiles: string[],
    virtualFiles?: Map<string, string>
  ): ProgramContext {
    const compilerOptions = ProgramFactory.getBaseCompilerOptions()

    let program: ts.Program

    if (virtualFiles && virtualFiles.size > 0) {
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
}
