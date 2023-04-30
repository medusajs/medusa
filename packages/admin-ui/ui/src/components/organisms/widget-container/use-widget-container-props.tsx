import { useNavigate } from "react-router-dom"
import useNotification from "../../../hooks/use-notification"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"

export const useWidgetContainerProps = () => {
  const notify = useNotification()
  const { featureToggleList, isFeatureEnabled } = useFeatureFlag()
  const navigate = useNavigate()

  return {
    notify,
    featureToggleList,
    isFeatureEnabled,
    navigate,
  }
}
