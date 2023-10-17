import { Customer } from "@medusajs/medusa";
import medusaRequest from "../request";

// Get customer with groups

const getCustomer = async (id: string) => {
    const path = `/admin/customers/${id}?expand=groups,orders,billing_address,shipping_addresses`;
    const res = await medusaRequest("GET", path);
    return res?.data?.customer as Customer;
}

export default getCustomer;
