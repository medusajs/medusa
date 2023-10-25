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
    const [permissions, setUsersPermissions] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [creating, setCreating] = useState(false);
    const [removing, setRemoving] = useState(false);

    useEffect(()=>{
        getPermissions();
    },[])

    // Get

    const getPermissions = () => {
        setUpdating(true);
        try{
            client.admin.custom.get('admin/permission').then(res=>{
                setUsersPermissions(res.permissions);
                console.log('***',res.permissions)
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
        data: PermissionsDataType,
        onSuccess: any
    ): ResponsePromise<any> => {
        setUpdating(true);
        try {
            let res = client.admin.custom.post(`/admin/permission/${id}`, data);
            onSuccess && onSuccess();
            setUpdating(false);
            return res;
        }
        catch(e) {
            console.log(e);
            setUpdating(false);
            return null;
        }
    }

    // Insert

    const create = async (
        data: PermissionsDataType,
        onSuccess: any
    ): ResponsePromise<any> => {
        setCreating(true);
        try {
            let res = client.admin.custom.post(`/admin/permission/`, data);
            onSuccess && onSuccess();
            setCreating(false);
            return res;
        }
        catch(e) {
            console.log(e);
            setCreating(false);
            return null;
        }
    }

    // Remove

    const remove = async (id: string): Promise<boolean> => {
        return true;
    }

  return {permissions, getPermissions, updating, update, create, creating, remove, removing}
}

export default usePermissions
