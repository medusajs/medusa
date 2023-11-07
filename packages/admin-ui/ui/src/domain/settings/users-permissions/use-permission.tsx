import { ResponsePromise } from "@medusajs/medusa-js";
import { useMedusa } from "medusa-react";
import { useEffect, useState } from "react"

export type PermissionsType = {
    id: string,
    name: string,
    metadata?: Record<string, unknown>
}

export type PermissionsDataType = {
    name: string,
    metadata?: Record<string, unknown>
}

const usePermissions = () => {
  
    const { client } = useMedusa();
    const [isLoading, setIsLoading] = useState(false);
    const [permissions, setPermissions] = useState<PermissionsType[]>([]);

    useEffect(()=>{
        fetch();
    },[]);

    // Refetch

    const fetch = async () => {
        let ps = await get();
        setPermissions(ps);
    }

    // Get

    const get = async (): Promise<PermissionsType[]> => {
        try{
            let res = await client.admin.custom.get('admin/permission');
            return res?.permissions || [];
        }
        catch(e) {
            return [];
        }
    }

    // Update

    const update = async (
        id: string,
        data: PermissionsDataType,
        onSuccess: any
    ): ResponsePromise<any> => {
        setIsLoading(true);
        try {
            let res = client.admin.custom.post(`/admin/permission/${id}`, data);
            onSuccess && onSuccess();
            setIsLoading(false);
            return res;
        }
        catch(e) {
            console.error(e);
            setIsLoading(false);
            return null;
        }
    }

    // Insert

    const create = async (
        data: PermissionsDataType,
        onSuccess: any
    ): ResponsePromise<any> => {
        setIsLoading(true);
        try {
            let res = client.admin.custom.post(`/admin/permission/`, data);
            onSuccess && onSuccess();
            setIsLoading(false);
            return res;
        }
        catch(e) {
            console.error(e);
            setIsLoading(false);
            return null;
        }
    }

    // Remove

    const remove = async (id: string): Promise<boolean> => {
        setIsLoading(true);
        setIsLoading(false);
        return true;
    }

  return {permissions, fetch, get, update, create, remove, isLoading}
}

export default usePermissions
