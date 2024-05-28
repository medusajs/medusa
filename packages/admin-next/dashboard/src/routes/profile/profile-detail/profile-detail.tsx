import { Outlet, json } from "react-router-dom"

import { useMe } from "../../../hooks/api/users"
import { ProfileGeneralSection } from "./components/profile-general-section"

import after from "virtual:medusa/widgets/profile/details/after"
import before from "virtual:medusa/widgets/profile/details/before"

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
      {before.widgets.map((w, i) => (
        <div key={i}>
          <w.Component data={user} />
        </div>
      ))}
      <ProfileGeneralSection user={user} />
      {after.widgets.map((w, i) => (
        <div key={i}>
          <w.Component data={user} />
        </div>
      ))}
      <Outlet />
    </div>
  )
}
