import { useRouteError } from "react-router-dom";

const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <div>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  );
};

export default ErrorBoundary;
