import Medusa from "@medusajs/medusa-js";
import { MEDUSA_BACKEND_URL } from "../../constants/medusa-backend-url"

// Get groups

export const getCustomersGroups = async (type: string) => {
    const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
    const { customer_groups } = await medusa.admin.customerGroups.list({limit: 0});
    return customer_groups.find(g=>g.metadata?.type == type);
}

// Remove customer from group

export const removeGroupCustomer = async (group_id: string | undefined, customer_id: string) => {
    if(group_id) {
        const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
        const { customer_group } = await medusa.admin.customerGroups.removeCustomers(group_id, {
            customer_ids: [
                {
                    id: customer_id
                }
            ]
        });
        return customer_group?.id;
    }
    else return true;
}

// Add customer to group

export const addGroupCustomer = async (group_id: string | undefined, customer_id: string) => {
    if(group_id) {
        const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
        const { customer_group } = await medusa.admin.customerGroups.addCustomers(group_id, {
            customer_ids: [
                {
                    id: customer_id
                }
            ]
        });
        return customer_group?.id;
    }
    else return true;
}