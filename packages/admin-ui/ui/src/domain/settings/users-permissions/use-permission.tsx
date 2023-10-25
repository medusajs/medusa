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
        try {
            let res = client.admin.custom.post(`/admin/permission/${id}`, data);
            onSuccess && onSuccess();
            return res;
        }
        catch(e) {
            console.log(e);
            return null;
        }
    }

    // Insert

    const insert = (
        data: PermissionsDataType,
        onReset: any
    ) => {
        onReset();
    }

  return {permissions, getPermissions, updating, update, insert}
}

export default usePermissions
