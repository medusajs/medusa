import { useEffect, useState } from "react";
import { Customer } from "@medusajs/medusa";
import getCustomer from "../utils/customers/getcustomer";

const useCustomerFull = (customerId: string) => {
    
    const [customer, setCustomer] = useState<Customer>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error>()

    const fetchCustomer = () => {
        setIsLoading(true);
        getCustomer(customerId).then(c=>{
            setIsLoading(false);
            setCustomer(c);
        })
        .catch(e=>{
            setIsLoading(false);
            setError(e);
        })
    }

    useEffect(()=>{
        fetchCustomer();
    },[])
    
    return {customer, fetchCustomer, isLoading, error}
}

export default useCustomerFull;