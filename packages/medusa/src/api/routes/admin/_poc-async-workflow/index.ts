import { Router } from "express"
import WorkflowOrchestrator, {
  WorkflowOrchestratorRunOptions,
} from "../../../../services/workflow-orchestrator"

const route = Router()

export default (app) => {
  app.use("/workflows", route)

  route.post("/:workflow_id", async (req, res) => {
    const { workflow_id } = req.params
    const options = req.body as WorkflowOrchestratorRunOptions<any>
    const { acknowledgement } = await WorkflowOrchestrator.run(
      workflow_id,
      options
    )
    return res.json(acknowledgement)
  })

  route.post(
    "/:workflow_id/:transaction_id/:step_id/success",
    async (req, res) => {
      const { workflow_id, transaction_id, step_id } = req.params
      const stepResponse = req.body
      await WorkflowOrchestrator.setStepSuccess({
        idempotencyKey: {
          action: "invoke",
          transactionId: transaction_id,
          stepId: step_id,
          workflowId: workflow_id,
        },
        stepResponse,
        options: {
          container: req.scope,
        },
      })
      return res.send("ok")
    }
  )

  const subscriber = (res) => {
    return async (...args) => {
      const data = JSON.stringify(args, null, 2)
      console.log(data)
      res.write(data)
    }
  }
  const subscriberId = "__sub__"

  route.post("/subscribe", async (req, res) => {
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

    const { workflow_id, transaction_id } = req.params as any
    WorkflowOrchestrator.subscribe({
      workflowId: workflow_id,
      transactionId: transaction_id,
      subscriber: subscriber(res),
      subscriberId,
    })
  })

  return route
}
