import { usePermissions } from "@medusajs/dashboard/hooks";
import { createDataTableFilterHelper } from "@medusajs/ui";
import { useMemo } from "react";
import { useCustomers } from "../api/customers";

const filterHelper = createDataTableFilterHelper<any>();

const useCustomerFilterOptions = (enabled: boolean) => {
  // TODO: Add ability to filter by email or name
  const { customers } = useCustomers({ limit: 1000 }, { enabled });

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
  const { hasPermission } = usePermissions();
  const canReadCustomers = hasPermission("customer:read");
  const customerFilterOptions = useCustomerFilterOptions(canReadCustomers);

  return useMemo(() => {
    if (!canReadCustomers) {
      return [];
    }

    return [
      filterHelper.accessor("customer_id", {
        type: "select",
        label: "Customer",
        options: customerFilterOptions ?? [],
      }),
    ];
  }, [canReadCustomers, customerFilterOptions]);
};
