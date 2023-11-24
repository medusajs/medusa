import myWorkflow from "./test-workflow.js"
import { WorkflowManager } from "@medusajs/orchestration"

console.log(myWorkflow)
console.log(WorkflowManager.getWorkflow("hello-world"))
