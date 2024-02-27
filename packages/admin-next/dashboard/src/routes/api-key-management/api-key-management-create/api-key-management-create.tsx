import { RouteFocusModal } from "../../../components/route-modal"
import { CreatePublishableApiKeyForm } from "./components/create-publishable-api-key-form"

export const ApiKeyManagementCreate = () => {
  return (
    <RouteFocusModal>
      <CreatePublishableApiKeyForm />
    </RouteFocusModal>
  )
}
