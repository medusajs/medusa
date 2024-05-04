import { Outlet, json, useLoaderData, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { useUser } from "../../../hooks/api/users"
import { UserGeneralSection } from "./components/user-general-section"
import { userLoader } from "./loader"

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
      <UserGeneralSection user={user} />
      <JsonViewSection data={user} />
      <Outlet />
    </div>
  )
}
