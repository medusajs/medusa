import { useMedusa } from "medusa-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type AccessContextType = {
    access: any
    checkAccess: (path: string) => boolean
  }
  

export const AccessContext = createContext<AccessContextType | null>(null)

export const AccessProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {

    const [access, setAccess] = useState();

    const { client: medusaClient } = useMedusa()
    
    const getAccess = async () => {
        let res = await medusaClient.admin.custom.get('admin/access');
        return res.access;
    }

    useEffect(()=>{
        getAccess().then(a=>{
            setAccess(a);
        })
    },[])

    const checkAccess = (path: string) => {
        
        if(access) {
        
            // Trim path
            
            path = path.replace(/^\/a/, '');
            
            // Check superuser
            
            if(access === true)
                return true;

            // Check access

            if(access.length)
                if(access.find(a=>String(path).startsWith(a.path) && a.access===true))
                    return true;

        }
        
        // Return false
        
        return false;
    }

    const values = useMemo(
        () => ({
          access,
          checkAccess,
        }),
        [access, checkAccess]
      )
    
    return (
        <AccessContext.Provider
            value={values}
        >
            {children}
        </AccessContext.Provider>
    )
}

export const useAccess = () => {

    const context = useContext(AccessContext)
  
    if (context === null) {
      throw new Error(
        "useAccess must be used within a AccessProvider"
      )
    }
  
    return context
  
}
