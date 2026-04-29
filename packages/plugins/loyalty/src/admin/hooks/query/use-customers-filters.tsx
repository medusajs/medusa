import { createDataTableFilterHelper } from "@medusajs/ui";
import { useMemo } from "react";
import { useCustomers } from "../api/customers";

const filterHelper = createDataTableFilterHelper<any>();

const useCustomerFilterOptions = () => {
  // TODO: Add ability to filter by email or name
  const { customers } = useCustomers({ limit: 1000 });

  return useMemo(() => {
    return customers?.map((customer) => {
      return {
        label: customer.email,
        value: customer.id,
      };
    });
  }, [customers]);
};

export const useCustomerFilters = () => {
  const customerFilterOptions = useCustomerFilterOptions();

  return useMemo(() => {
    return [
      filterHelper.accessor("customer_id", {
        type: "select",
        label: "Customer",
        options: customerFilterOptions ?? [],
      }),
    ];
  }, [customerFilterOptions]);
};
