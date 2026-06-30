import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type SetActiveLayoutScopeStepInput = {
  zone: string
  user_id: string
  scope?: "personal" | "default"
}

export const setActiveLayoutScopeStepId = "set-active-layout-scope"

export const setActiveLayoutScopeStep = createStep(
  setActiveLayoutScopeStepId,
  async (input: SetActiveLayoutScopeStepInput, { container }) => {
    const service = container.resolve(Modules.SETTINGS)

    const previousScope = await service.getActiveLayoutScope(
      input.zone,
      input.user_id
    )

    await service.setActiveLayoutScope(input.zone, input.user_id, input.scope ?? null)

    return new StepResponse(input.scope, {
      zone: input.zone,
      user_id: input.user_id,
      previousScope,
    })
  },
  async (compensateInput, { container }) => {
    if (!compensateInput) {
      return
    }

    const service = container.resolve(Modules.SETTINGS)

    await service.setActiveLayoutScope(
      compensateInput.zone,
      compensateInput.user_id,
      compensateInput.previousScope
    )
  }
)
