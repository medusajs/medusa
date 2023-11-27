/* eslint-disable no-case-declarations */
import { WorkflowManager } from "@medusajs/orchestration"
import path from "path"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import registerWorkflows from "../utils/register-workflows.js"
import createDiagram from "../utils/create-diagram.js"

type Options = {
  output: string
  type: "docs" | "markdown" | "mermaid"
  theme: boolean
}

export default async function (workflowPath: string, options: Options) {
  const workflowDefinitions = await registerWorkflows(workflowPath)

  const registeredWorkflows = WorkflowManager.getWorkflows()

  for (const [name, workflow] of registeredWorkflows) {
    const diagram = createDiagram({
      workflow: workflow.flow_,
      addTheme: options.theme,
    })

    switch (options.type) {
      case "docs":
        // write files
        const workflowPath = path.join(options.output, name)
        if (!existsSync(workflowPath)) {
          mkdirSync(workflowPath, { recursive: true })
        }

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
