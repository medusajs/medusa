import { useLocation } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { getApiKeyTypeFromPathname } from "../common/utils"
import { CreatePublishableApiKeyForm } from "./components/create-publishable-api-key-form"

export const ApiKeyManagementCreate = () => {
  const { pathname } = useLocation()
  const keyType = getApiKeyTypeFromPathname(pathname)

  return (
    <RouteFocusModal>
      <CreatePublishableApiKeyForm keyType={keyType} />
    </RouteFocusModal>
  )
}
