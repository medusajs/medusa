import { ResponsePromise } from "@medusajs/medusa-js";
import { useMedusa } from "medusa-react";
import { useEffect, useState } from "react"

export type RolesType = {
    id: string,
    name: string,
    metadata?: Record<string, unknown>
}

export type RolesDataType = {
    name: string,
    metadata?: Record<string, unknown>
}

const useRoles = () => {
  
    const { client } = useMedusa();
    const [roles, setUsersRoles] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [creating, setCreating] = useState(false);
    const [removing, setRemoving] = useState(false);

    useEffect(()=>{
        getRoles();
    },[])

    // Get

    const getRoles = () => {
        setUpdating(true);
        try{
            client.admin.custom.get('admin/role').then(res=>{
                setUsersRoles(res.roles);
                console.log(res.roles)
                setUpdating(false);
            })
        }
        catch(e) {
            setUpdating(false);
        }
    }

    // Update

    const update = async (
        id: string,
        data: RolesDataType,
        onSuccess: any
    ): ResponsePromise<any> => {
        setUpdating(true);
        try {
            let res = client.admin.custom.post(`/admin/role/${id}`, data);
            onSuccess && onSuccess();
            setUpdating(false);
            return res;
        }
        catch(e) {
            console.error(e);
            setUpdating(false);
            return null;
        }
    }

    // Insert

    const create = async (
        data: RolesDataType,
        onSuccess: any
    ): ResponsePromise<any> => {
        setCreating(true);
        try {
            let res = client.admin.custom.post(`/admin/role/`, data);
            onSuccess && onSuccess();
            setCreating(false);
            return res;
        }
        catch(e) {
            console.error(e);
            setCreating(false);
            return null;
        }
    }

    // Remove

    const remove = async (id: string): Promise<boolean> => {
        setRemoving(true);
        setRemoving(false);
        return true;
    }

  return {roles, getRoles, updating, update, create, creating, remove, removing}
}

export default useRoles
