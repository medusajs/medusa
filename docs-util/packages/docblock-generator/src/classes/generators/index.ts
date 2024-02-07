import ts from "typescript"
import Formatter from "../helpers/formatter.js"
import KindsRegistry from "../kinds/registry.js"
import GeneratorEventManager from "../helpers/generator-event-manager.js"
import { CommonCliOptions } from "../../types/index.js"

export type Options = {
  paths: string[]
  dryRun?: boolean
} & Pick<CommonCliOptions, "generateExamples">

abstract class AbstractGenerator {
  protected options: Options
  protected program?: ts.Program
  protected checker?: ts.TypeChecker
  protected formatter: Formatter
  protected kindsRegistry?: KindsRegistry
  protected generatorEventManager: GeneratorEventManager

  constructor(options: Options) {
    this.options = options
    this.formatter = new Formatter()
    this.generatorEventManager = new GeneratorEventManager()
  }

  init() {
    this.program = ts.createProgram(this.options.paths, {})

    this.checker = this.program.getTypeChecker()

    const { generateExamples } = this.options

    this.kindsRegistry = new KindsRegistry({
      checker: this.checker,
      generatorEventManager: this.generatorEventManager,
      additionalOptions: {
        generateExamples,
      },
    })
  }

  /**
   * Generate the docblock for the paths specified in the {@link options} class property.
   */
  abstract run(): void

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
   * Reset the generator's properties for new usage.
   */
  reset() {
    this.program = undefined
    this.checker = undefined
  }
}

export default AbstractGenerator
