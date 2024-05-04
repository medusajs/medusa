import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  // Currently, the home page simply redirects to the orders page
  useEffect(() => {
    navigate("/orders", { replace: true });
  }, [navigate]);

  return <div />;
};
