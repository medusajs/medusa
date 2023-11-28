/* eslint-disable no-case-declarations */
import { WorkflowManager } from "@medusajs/orchestration"
import * as path from "path"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import registerWorkflows from "../utils/register-workflows.js"
import DiagramBuilder from "../classes/diagram-builder.js"

type Options = {
  output: string
  type: "docs" | "markdown" | "mermaid"
  theme: boolean
  prettyNames: boolean
}

export default async function (workflowPath: string, options: Options) {
  const workflowDefinitions = await registerWorkflows(workflowPath)

  const registeredWorkflows = WorkflowManager.getWorkflows()

  const diagramBuilder = new DiagramBuilder(options)

  for (const [name, workflow] of registeredWorkflows) {
    const diagram = diagramBuilder.buildDiagram(workflow.flow_)
    if (!existsSync(options.output)) {
      mkdirSync(options.output, { recursive: true })
    }

    switch (options.type) {
      case "docs":
        const workflowPath = path.join(options.output, name)
        if (!existsSync(workflowPath)) {
          mkdirSync(workflowPath, { recursive: true })
        }
        // write files
        writeFileSync(path.join(workflowPath, "diagram.mermaid"), diagram)
        const workflowDefinition = workflowDefinitions.get(workflow.id)
        if (workflowDefinition) {
          writeFileSync(path.join(workflowPath, "code.ts"), workflowDefinition)
        }
        break
      case "mermaid":
        writeFileSync(path.join(options.output, `${name}.mermaid`), diagram)
        break
      case "markdown":
        writeFileSync(
          path.join(options.output, `${name}.md`),
          `\`\`\`mermaid\n${diagram}\n\`\`\``
        )
    }
  }

  console.log(`Generated diagrams for ${registeredWorkflows.size} workflows.`)
}
