import { Outlet, useLocation } from "react-router-dom"
import { Gutter } from "./gutter"
import { MainNav } from "./main-nav"
import { SettingsNav } from "./settings-nav"
import { Topbar } from "./topbar"

export const AppLayout = () => {
  const location = useLocation()

  const isSettings = location.pathname.startsWith("/settings")

  return (
    <div className="flex h-screen flex-col items-start overflow-hidden md:flex-row">
      <MainNav />
      <div className="flex h-[calc(100vh-57px)] w-full md:h-screen">
        {isSettings && <SettingsNav />}
        <div className="flex h-full w-full flex-col items-center overflow-y-auto p-4">
          <Gutter>
            <Topbar />
            <Outlet />
          </Gutter>
        </div>
      </div>
    </div>
  )
}
