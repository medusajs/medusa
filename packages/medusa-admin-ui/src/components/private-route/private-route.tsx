import { useAdminGetSession } from "medusa-react";
import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type PrivateRouteProps = PropsWithChildren;

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, isLoading } = useAdminGetSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading]);

  if (user && !isLoading) {
    return { children };
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <p>Loading...</p>
    </div>
  );
};

export default PrivateRoute;
