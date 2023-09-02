import React, { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import { useWindowDimensions } from "../../hooks/use-window-dimensions"
import Sidebar from "../organisms/sidebar"
import Topbar from "../organisms/topbar"

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { width } = useWindowDimensions()
  const [isSidebarOpen, toggleSidebar] = useState(false)

  useEffect(() => {
    toggleSidebar(width > 1024)
  }, [width, toggleSidebar])

  return (
    <div className="inter-base-regular text-grey-90 medium:w-full flex h-screen w-screen">
      <Toaster
        containerStyle={{
          top: 74,
          left: 24,
          bottom: 24,
          right: 24,
        }}
      />
      {isSidebarOpen && <Sidebar toggleSidebar={toggleSidebar} />}
      <div className="flex flex-1 flex-col">
        <Topbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="large:px-xlarge py-xlarge bg-grey-5 min-h-content overflow-y-auto">
          <main className="xsmall:mx-base small:mx-xlarge medium:mx-4xlarge large:mx-auto large:max-w-7xl large:w-full h-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout
