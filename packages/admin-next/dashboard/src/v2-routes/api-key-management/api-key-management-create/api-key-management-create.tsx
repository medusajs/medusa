import { useSearchParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { ApiKeyType } from "../common/constants"
import { CreatePublishableApiKeyForm } from "./components/create-publishable-api-key-form"

export const ApiKeyManagementCreate = () => {
  const [searchParams] = useSearchParams()
  const keyType =
    (searchParams.get("keyType") as ApiKeyType | null) ?? ApiKeyType.PUBLISHABLE

  return (
    <RouteFocusModal>
      <CreatePublishableApiKeyForm keyType={keyType} />
    </RouteFocusModal>
  )
}
