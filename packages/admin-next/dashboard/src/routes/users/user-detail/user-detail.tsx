import { useAdminUser } from "medusa-react"
import { Outlet, json, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { UserGeneralSection } from "./components/user-general-section"

export const UserDetail = () => {
  const { id } = useParams()
  const { user, isLoading, isError, error } = useAdminUser(id!)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !user) {
    if (error) {
      throw error
    }

    throw json("An unknown error has occured", 500)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <UserGeneralSection user={user} />
      <JsonViewSection data={user} />
      <Outlet />
    </div>
  )
}
