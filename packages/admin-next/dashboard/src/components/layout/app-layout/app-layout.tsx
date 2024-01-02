import { Outlet, useLocation } from "react-router-dom";
import { Gutter } from "./gutter";
import { MainNav } from "./main-nav";
import { SettingsNav } from "./settings-nav";
import { Topbar } from "./topbar";

export const AppLayout = () => {
  const location = useLocation();

  const isSettings = location.pathname.startsWith("/settings");

  return (
    <div className="flex flex-col md:flex-row items-start h-screen overflow-hidden">
      <MainNav />
      <div className="w-full h-[calc(100vh-57px)] md:h-screen flex">
        {isSettings && <SettingsNav />}
        <div className="w-full h-full flex flex-col items-center overflow-y-auto p-4">
          <Gutter>
            <Topbar />
            <Outlet />
          </Gutter>
        </div>
      </div>
    </div>
  );
};
