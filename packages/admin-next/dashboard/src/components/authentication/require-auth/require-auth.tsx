import { Spinner } from "@medusajs/icons";
import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../../providers/auth-provider";

export const RequireAuth = ({ children }: PropsWithChildren) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="animate-spin text-ui-fg-interactive" />
      </div>
    );
  }

  if (!auth.user) {
    console.log("redirecting");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
