import { Outlet, json } from "react-router-dom"
import { ProfileGeneralSection } from "./components/profile-general-section"
import { useV2Session } from "../../../lib/api-v2"

export const ProfileDetail = () => {
  const { user, isLoading, isError, error } = useV2Session()

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
