import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { IWorkflowOrchestratorModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

const subscriber = (res) => {
  return async (...args) => {
    const data = JSON.stringify(args, null, 2)
    console.log(data)
    res.write(data)
  }
}
const subscriberId = "__sub__"

export default async function (req: MedusaRequest, res: MedusaResponse) {
  const workflowOrchestratorService: IWorkflowOrchestratorModuleService =
    req.scope.resolve(ModuleRegistrationName.WORKFLOW_ORCHESTRATOR)

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  })

  req.on("close", () => {
    res.end()
  })

  req.on("error", (err: any) => {
    if (err.code === "ECONNRESET") {
      res.end()
    }
  })

  const { workflow_id, transaction_id } = req.query as any
  void workflowOrchestratorService.subscribe({
    workflowId: workflow_id,
    transactionId: transaction_id,
    subscriber: subscriber(res),
    subscriberId,
  })
}
