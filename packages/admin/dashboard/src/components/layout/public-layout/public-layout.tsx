import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"

import { DocumentTitle } from "../../../hooks/use-document-title"

export const PublicLayout = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    document.body.style.pointerEvents = ""
  }, [pathname])

  return (
    <>
      <DocumentTitle />
      <Outlet />
    </>
  )
}
