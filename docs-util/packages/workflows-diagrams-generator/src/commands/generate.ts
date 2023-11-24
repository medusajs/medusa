import { WorkflowManager } from "@medusajs/orchestration"
import path from "path"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import registerWorkflows from "../utils/register-workflows.js"
import createDiagram from "../utils/create-diagram.js"

type Options = {
  output: string
  type: "docs" | "markdown" | "mermaid"
}

export default async function (workflowPath: string, options: Options) {
  await registerWorkflows(workflowPath)

  const registeredWorkflows = WorkflowManager.getWorkflows()

  switch (options.type) {
    case "docs":
      for (const [name, workflow] of registeredWorkflows) {
        const diagram = createDiagram(workflow.flow_)

        // write files
        const workflowPath = path.join(options.output, name)
        if (!existsSync(workflowPath)) {
          mkdirSync(workflowPath)
        }

        writeFileSync(path.join(workflowPath, "diagram.mermaid"), diagram)
        // writeFileSync(path.join(workflowPath, "code.ts"), workflow.code)
      }
  }
}
