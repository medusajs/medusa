import { PropsWithChildren, useState } from "react"
import { SidebarContext } from "./sidebar-context"

export const SidebarProvider = ({ children }: PropsWithChildren) => {
  const [desktop, setDesktop] = useState(true)
  const [mobile, setMobile] = useState(false)

  const toggle = (view: "desktop" | "mobile") => {
    if (view === "desktop") {
      setDesktop(!desktop)
    } else {
      setMobile(!mobile)
    }
  }

  return (
    <SidebarContext.Provider value={{ desktop, mobile, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}
