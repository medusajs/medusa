import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const Settings = () => {
  // Redirect to the first child route if the user navigates to /settings which is /settings/profile
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/settings") {
      navigate("/settings/profile");
    }
  }, [location.pathname, navigate]);

  return <Outlet />;
};
