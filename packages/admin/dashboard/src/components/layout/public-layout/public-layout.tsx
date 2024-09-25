import { Outlet } from "react-router-dom"

export const PublicLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-6">
      <div className="bg-ui-bg-base text-ui-fg-subtle shadow-elevation-modal flex w-[520px] flex-col items-center gap-y-12 rounded-[32px] px-16 py-20">
        <div className="bg-ui-bg-subtle shadow-elevation-card-hover h-24 w-24 rounded-3xl"></div>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
