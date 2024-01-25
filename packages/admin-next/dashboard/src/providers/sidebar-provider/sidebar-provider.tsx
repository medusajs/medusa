import { PropsWithChildren, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { SidebarContext } from "./sidebar-context"

export const SidebarProvider = ({ children }: PropsWithChildren) => {
  const [desktop, setDesktop] = useState(true)
  const [mobile, setMobile] = useState(false)
  const { pathname } = useLocation()

  const toggle = (view: "desktop" | "mobile") => {
    if (view === "desktop") {
      setDesktop(!desktop)
    } else {
      setMobile(!mobile)
    }
  }

  useEffect(() => {
    setMobile(false)
  }, [pathname])

  return (
    <SidebarContext.Provider value={{ desktop, mobile, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}
