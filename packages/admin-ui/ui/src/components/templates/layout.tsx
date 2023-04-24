import React, { useState } from "react"
import Sidebar from "../organisms/sidebar"
import Topbar from "../organisms/topbar"
import { PollingProvider } from "../../context/polling"
import clsx from "clsx"

const Layout: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div
      className={clsx(
        "flex w-full h-screen inter-base-regular text-grey-90 relative"
      )}
    >
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={clsx(
          { "opacity-0 pointer-events-none": !isSidebarOpen },
          "fixed small:hidden inset-0 bg-gray-700 bg-opacity-10 transition-opacity backdrop-blur-sm z-10"
        )}
      />
      <Sidebar
        className={clsx(
          {
            "-translate-x-[240px]": !isSidebarOpen,
            "translate-x-0": isSidebarOpen,
          },
          "absolute small:translate-x-0 origin-left transition-transform small:transition-none small:relative top-14 small:top-0 z-20 small:block bg-white"
        )}
        toggleSidebar={setIsSidebarOpen}
      />
      <PollingProvider>
        <div className="flex flex-col flex-1">
          <Topbar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={setIsSidebarOpen}
          />
          <div className="large:px-xlarge py-xlarge bg-grey-5 min-h-content overflow-y-auto">
            <main className="xsmall:mx-base small:mx-xlarge medium:mx-4xlarge large:mx-auto large:max-w-7xl large:w-full h-full">
              {children}
            </main>
          </div>
        </div>
      </PollingProvider>
    </div>
  )
}

export default Layout
