import { useLocation } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import { getApiKeyTypeFromPathname } from "../common/utils"
import { ApiKeyCreateForm } from "./components/api-key-create-form"

export const ApiKeyManagementCreate = () => {
  const { pathname } = useLocation()
  const keyType = getApiKeyTypeFromPathname(pathname)

  return (
    <RouteFocusModal>
      <ApiKeyCreateForm keyType={keyType} />
    </RouteFocusModal>
  )
}
