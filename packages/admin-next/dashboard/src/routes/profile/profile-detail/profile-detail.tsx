import { useAdminGetSession } from "medusa-react"
import { Outlet, json } from "react-router-dom"
import { ProfileGeneralSection } from "./components/profile-general-section"

export const ProfileDetail = () => {
  const { user, isLoading, isError, error } = useAdminGetSession()

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
      <ProfileGeneralSection user={user} />
      <Outlet />
    </div>
  )
}
