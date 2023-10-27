import { ResponsePromise } from "@medusajs/medusa-js";
import { useMedusa } from "medusa-react";
import { useEffect, useState } from "react"
import { PermissionsType } from "../users-permissions/use-permission";

export type RolesType = {
    id: string,
    name: string,
    permissions?: PermissionsType[]
}

export type RolesDataType = {
    name: string,
    permissions?: string[]
}

const useRoles = () => {
  
    const { client } = useMedusa();
    
    const [roles, setRoles] = useState<RolesType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(()=>{
        fetch();
    },[]);

    // Fetch

    const fetch = async () => {
        let rs = await get();
        setRoles(rs);
    }

    // Get

    const get = async (): Promise<RolesType[]> => {
        try{
            let res = await client.admin.custom.get('admin/role');
            return res?.roles || [];
        }
        catch(e) {
            return [];
        }
    }

    // Update

    const update = async (
        id: string,
        data: RolesDataType,
        onSuccess: any
    ): ResponsePromise<any> => {
        setIsLoading(true);
        try {
            let res = client.admin.custom.post(`/admin/role/${id}`, data);
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
        data: RolesDataType,
        onSuccess: any
    ): ResponsePromise<any> => {
        setIsLoading(true);
        try {
            let res = client.admin.custom.post(`/admin/role/`, data);
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

    // Set role for user

    const setRole = async (user_id: string, id:string) => {
        setIsLoading(true);
        try {
            let res = client.admin.custom.post(`/admin/user/${user_id}/setrole`, {role_id: id});
            setIsLoading(false);
            return res;
        }
        catch(e) {
            console.error(e);
            setIsLoading(false);
            return null;
        }
    }

  return {roles, fetch, get, update, create, remove, setRole, isLoading}
}

export default useRoles
