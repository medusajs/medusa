import Medusa from "@medusajs/medusa-js"
import { MEDUSA_BACKEND_URL } from "../../../constants/medusa-backend-url";
import { useEffect, useState } from "react";
import { Customer } from "@medusajs/medusa";

const useCustomerFull = (customerId: string) => {
    
    const [customer, setCustomer] = useState<Customer>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error>()

    useEffect(()=>{

        // Modify retrieve method to get billing address

        const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
        medusa.admin.customers.retrieve = (
            id: string,
            customHeaders: Record<string, any> = {}
        ) => {
            const path = `/admin/customers/${id}?expand=billing_address,shipping_addresses,orders`
            return medusa.admin.customers.client.request("GET", path, undefined, {}, customHeaders)
        }

        // Get customer

        medusa.admin.customers.retrieve(customerId, {expand: "billing_address,orders"})
        .then((res)=>{
            setIsLoading(false);
            setCustomer(res?.customer as Customer);
        })
        .catch(e=>{
            setIsLoading(false);
            setError(e);
        })
    },[])
    
    return {customer, isLoading, error}
}

export default useCustomerFull;