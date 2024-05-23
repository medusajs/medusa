import { Outlet, json } from "react-router-dom"
import { useMe } from "../../../hooks/api/users"
import { ProfileGeneralSection } from "./components/profile-general-section"

export const ProfileDetail = () => {
  const { user, isPending: isLoading, isError, error } = useMe()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !user) {
    if (error) {
      throw error
    }

    throw json("An unknown error has occurred", 500)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <ProfileGeneralSection user={user} />
      <Outlet />
    </div>
  )
}
