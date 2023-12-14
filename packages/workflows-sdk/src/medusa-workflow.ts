export class MedusaWorkflow {
  static registerWorkflow(workflowId, exportedWorkflow) {
    global.MedusaWorkflow[workflowId] = exportedWorkflow
  }

  static getWorkflow(workflowId) {
    return global.MedusaWorkflow[workflowId]
  }
}

global.MedusaWorkflow ??= MedusaWorkflow
exports.MedusaWorkflow = global.MedusaWorkflow
