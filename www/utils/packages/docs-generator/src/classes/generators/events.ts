import ts from "typescript"
import EventsKindGenerator from "../kinds/events.js"
import AbstractGenerator from "./index.js"
import { GeneratorEvent } from "../helpers/generator-event-manager.js"
import { minimatch } from "minimatch"
import getBasePath from "../../utils/get-base-path.js"
import { getEventsOutputBasePath } from "../../utils/get-output-base-paths.js"

class EventsGenerator extends AbstractGenerator {
  protected eventsKindGenerator?: EventsKindGenerator

  async run() {
    this.init()

    this.eventsKindGenerator = new EventsKindGenerator({
      checker: this.checker!,
      generatorEventManager: this.generatorEventManager,
    })
    const events: Record<string, unknown>[] = []

    await Promise.all(
      this.program!.getSourceFiles().map(async (file) => {
        // Ignore .d.ts files
        if (file.isDeclarationFile || !this.isFileIncluded(file.fileName)) {
          return
        }

        const fileNodes: ts.Node[] = [file]

        console.log(`[EVENTS] Generating for ${file.fileName}...`)

        // since typescript's compiler API doesn't support
        // async processes, we have to retrieve the nodes first then
        // traverse them separately.
        const pushNodesToArr = (node: ts.Node) => {
          fileNodes.push(node)

          ts.forEachChild(node, pushNodesToArr)
        }
        ts.forEachChild(file, pushNodesToArr)

        await this.eventsKindGenerator!.populateWorkflows()

        const documentChild = async (node: ts.Node) => {
          if (
            this.eventsKindGenerator!.isAllowed(node) &&
            this.eventsKindGenerator!.canDocumentNode(node)
          ) {
            const eventsJson = await this.eventsKindGenerator!.getDocBlock(node)
            events.push(...JSON.parse(eventsJson))
          }
        }

        await Promise.all(
          fileNodes.map(async (node) => await documentChild(node))
        )

        this.generatorEventManager.emit(GeneratorEvent.FINISHED_GENERATE_EVENT)
        console.log(`[EVENTS] Finished generating for ${file.fileName}.`)
      })
    )

    if (!this.options.dryRun) {
      this.writeJson(events)
    }
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
      minimatch(
        getBasePath(fileName),
        "packages/core/utils/src/**/events.ts",
        {
          matchBase: true,
        }
      )
    )
  }

  /**
   * This method writes the DML JSON file. If the file already exists, it only updates
   * the data model's object in the JSON file.
   *
   * @param filePath - The path of the file to write the DML JSON to.
   * @param dataModelJson - The DML JSON.
   */
  writeJson(events: Record<string, unknown>[]) {
    const filePath = getEventsOutputBasePath()
    const eventsJson = JSON.stringify(events, null, 2)

    ts.sys.writeFile(filePath, eventsJson)
  }
}

export default EventsGenerator
