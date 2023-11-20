import React, { useState, useEffect } from "react"
import { Toaster } from "react-hot-toast"
import Sidebar from "../organisms/sidebar"
import Topbar from "../organisms/topbar"
import { useWindowDimensions } from "../../hooks/use-window-dimensions"

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { width } = useWindowDimensions()
  const [isSidebarOpen, toggleSidebar] = useState(false)

  useEffect(() => {
    toggleSidebar(width > 1024)
  }, [width, toggleSidebar])

  return (
    // fix fixed height in product page
    <div className="inter-base-regular text-grey-90 flex h-screen w-full">
      <Toaster
        containerStyle={{
          top: 74,
          left: 24,
          bottom: 24,
          right: 24,
        }}
      />
      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1 flex-col">
        <Topbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="large:px-xlarge py-xlarge bg-grey-5 overflow-y-auto">
          <main className="xsmall:mx-base small:mx-xlarge medium:mx-4xlarge large:mx-auto large:max-w-7xl large:w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout
