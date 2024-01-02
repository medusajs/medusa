import { AdminProductsRes } from "@medusajs/medusa";
import { Response } from "@medusajs/medusa-js";
import { adminProductKeys } from "medusa-react";
import { LoaderFunctionArgs, redirect } from "react-router-dom";

import { FetchQueryOptions } from "@tanstack/react-query";
import { medusa, queryClient } from "../../../../lib/medusa";

const productDetailQuery = (id: string) => ({
  queryKey: adminProductKeys.detail(id),
  queryFn: async () => medusa.admin.products.retrieve(id),
});

const fetchQuery = async (
  query: FetchQueryOptions<Response<AdminProductsRes>>
) => {
  try {
    const res = await queryClient.fetchQuery(query);
    return res;
  } catch (error) {
    const err = error ? JSON.parse(JSON.stringify(error)) : null;

    console.log(err);

    if ((err as Error & { status: number })?.status === 401) {
      redirect("/login", 401);
    }
  }
};

export const productLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id;
  const query = productDetailQuery(id!);

  return (
    queryClient.getQueryData<Response<AdminProductsRes>>(query.queryKey) ??
    (await fetchQuery(query))
  );
};
