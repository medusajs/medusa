import { MedusaProvider as Provider } from "medusa-react";
import { PropsWithChildren } from "react";
import { queryClient } from "../services";

type MedusaProviderProps = PropsWithChildren;

export const MedusaProvider = ({ children }: MedusaProviderProps) => {
  return (
    <Provider
      baseUrl="/"
      queryClientProviderProps={{
        client: queryClient,
      }}
    >
      {children}
    </Provider>
  );
};
