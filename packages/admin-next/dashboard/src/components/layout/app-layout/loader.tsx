import { QueryClient } from "@tanstack/react-query";
import { adminProductKeys } from "medusa-react";
import { LoaderFunctionArgs } from "react-router-dom";
import { medusa, queryClient } from "../../../lib/medusa";

const appLoaderQuery = (id: string) => ({
  queryKey: adminProductKeys.detail(id),
  queryFn: async () => medusa.admin.products.retrieve(id),
});

export const productLoader = (client: QueryClient) => {
  return async ({ params }: LoaderFunctionArgs) => {
    const id = params?.id;

    if (!id) {
      throw new Error("No id provided");
    }

    const query = appLoaderQuery(id);

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await client.fetchQuery(query))
    );
  };
};
