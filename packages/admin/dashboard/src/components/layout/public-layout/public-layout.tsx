import { Outlet } from "react-router-dom"

import { DocumentTitle } from "../../../hooks/use-document-title"

export const PublicLayout = () => {
  return (
    <>
      <DocumentTitle />
      <Outlet />
    </>
  )
}
