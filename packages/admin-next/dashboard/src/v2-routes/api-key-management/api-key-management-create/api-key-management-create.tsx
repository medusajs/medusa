import { RouteFocusModal } from "../../../components/route-modal"
import { useMe } from "../../../hooks/api/users"
import { CreatePublishableApiKeyForm } from "./components/create-publishable-api-key-form"

export const ApiKeyManagementCreate = () => {
  const { user, isLoading, isError, error } = useMe()

  const ready = !isLoading && !!user

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {ready && <CreatePublishableApiKeyForm user={user} />}
    </RouteFocusModal>
  )
}
