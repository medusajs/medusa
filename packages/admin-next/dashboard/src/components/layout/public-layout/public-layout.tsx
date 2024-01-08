import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <div className="bg-ui-bg-base text-ui-fg-subtle w-[520px] px-16 py-20 rounded-[32px] shadow-elevation-modal flex flex-col gap-y-12 items-center">
        <div className="w-24 h-24 rounded-3xl bg-ui-bg-subtle shadow-elevation-card-hover"></div>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
