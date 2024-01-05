import { Router } from "express"
import { IWorkflowOrchestratorModuleService } from "@medusajs/types"
import { WorkflowOrchestratorRunDTO } from "@medusajs/types/src"

const route = Router()

export default (app) => {
  app.use("/workflows", route)

  const subscriber = (res) => {
    return async (...args) => {
      const data = JSON.stringify(args, null, 2)
      console.log(data)
      res.write(data)
    }
  }
  const subscriberId = "__sub__"

  route.get("/subscribe", async (req, res) => {
    const workflowOrchestratorService: IWorkflowOrchestratorModuleService =
      req.scope.resolve("workflowOrchestratorService")

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
  })

  route.post("/:workflow_id", async (req, res) => {
    const workflowOrchestratorService: IWorkflowOrchestratorModuleService =
      req.scope.resolve("workflowOrchestratorService")

    const { workflow_id } = req.params
    const options = req.body as WorkflowOrchestratorRunDTO
    const { acknowledgement } = await workflowOrchestratorService.run(
      workflow_id,
      options
    )
    return res.json(acknowledgement)
  })

  route.post(
    "/:workflow_id/:transaction_id/:step_id/success",
    async (req, res) => {
      const workflowOrchestratorService: IWorkflowOrchestratorModuleService =
        req.scope.resolve("workflowOrchestratorService")

      const { workflow_id, transaction_id, step_id } = req.params
      const stepResponse = req.body
      await workflowOrchestratorService.setStepSuccess({
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

  return route
}
