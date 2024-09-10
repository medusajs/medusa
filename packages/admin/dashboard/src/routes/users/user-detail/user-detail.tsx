import { Outlet, json, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useUser } from "../../../hooks/api/users"
import { UserGeneralSection } from "./components/user-general-section"
import { userLoader } from "./loader"

import after from "virtual:medusa/widgets/user/details/after"
import before from "virtual:medusa/widgets/user/details/before"

export const UserDetail = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof userLoader>>

  const { id } = useParams()
  const {
    user,
    isPending: isLoading,
    isError,
    error,
  } = useUser(id!, undefined, {
    initialData,
  })

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
      {before.widgets.map((w, i) => (
        <div key={i}>
          <w.Component data={user} />
        </div>
      ))}
      <UserGeneralSection user={user} />
      {after.widgets.map((w, i) => (
        <div key={i}>
          <w.Component data={user} />
        </div>
      ))}
      <JsonViewSection data={user} />
      <Outlet />
    </div>
  )
}
