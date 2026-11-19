import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { CLOUD_MODULE } from "../modules/cloud"
import CloudModuleService from "../modules/cloud/service"
import { CloudAnnouncementPreferences } from "../types"
export type UpdateAnnouncementPreferencesWorkflowInput = {
  preferences: Partial<CloudAnnouncementPreferences>
}

export const updateAnnouncementPreferencesStepId =
  "update-announcement-preferences"
export const updateAnnouncementPreferencesStep = createStep(
  updateAnnouncementPreferencesStepId,
  async (
    { preferences }: UpdateAnnouncementPreferencesWorkflowInput,
    { container }
  ) => {
    const service = container.resolve<CloudModuleService>(CLOUD_MODULE)
    const [previous] = await service.listCloudAnnouncementPreferences(
      {},
      { take: 1 }
    )

    const { id, security, feature, cloud } = previous
      ? await service.updateCloudAnnouncementPreferences({
          id: previous.id,
          ...preferences,
        })
      : await service.createCloudAnnouncementPreferences(preferences)

    return new StepResponse<
      CloudAnnouncementPreferences,
      { id: string; previous?: CloudAnnouncementPreferences }
    >(
      { security, feature, cloud },
      {
        id,
        previous: previous && {
          security: previous.security,
          feature: previous.feature,
          cloud: previous.cloud,
        },
      }
    )
  },
  async (data, { container }) => {
    if (!data) {
      return
    }

    const service = container.resolve<CloudModuleService>(CLOUD_MODULE)

    if (data.previous) {
      await service.updateCloudAnnouncementPreferences({
        id: data.id,
        ...data.previous,
      })
    } else {
      await service.deleteCloudAnnouncementPreferences(data.id)
    }
  }
)

export const updateAnnouncementPreferencesWorkflowId =
  "update-announcement-preferences"
/**
 * Updates the Medusa Cloud announcement categories shown to the team.
 * Categories that aren't passed keep their value.
 */
export const updateAnnouncementPreferencesWorkflow = createWorkflow(
  updateAnnouncementPreferencesWorkflowId,
  (input: WorkflowData<UpdateAnnouncementPreferencesWorkflowInput>) => {
    return new WorkflowResponse(updateAnnouncementPreferencesStep(input))
  }
)
