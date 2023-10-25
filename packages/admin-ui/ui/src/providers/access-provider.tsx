import { useMedusa } from "medusa-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type accessType = {
    path: string,
    access: boolean
}

type AccessContextType = {
    access?: accessType[]
    startPage?: string
    checkAccess: (path: string) => boolean,
    getAccess: () => Promise<boolean>
}

export const AccessContext = createContext<AccessContextType | null>(null)

export const AccessProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {

    const [access, setAccess] = useState<accessType[]>();
    const { client: medusaClient } = useMedusa()
    const [startPage, setStartPage] = useState('');

    // Get access
    
    const getAccess = async () : Promise<boolean> => {
        try{
            let res = await medusaClient.admin.custom.get('admin/access');
            setAccess(res.access || []);
            return true;
        }
        catch(e) {
            return false;
        }
    }

    useEffect(()=>{
        getAccess();
    },[])

    // Get start page

    const getStartPage = () => {
            
        if(access) {

            // Init start pages
    
            let starts = [
              '/orders',
              '/products',
              '/customers',
            ];
            
            // Check default start pages
            
            for(let s of starts) {
              if(checkAccess(s)) {
                setStartPage('/a'+s);
                return;
              }
            }
    
            // Check from access
    
            if(startPage === '' && access?.length)
                for(let a of access) {
                    setStartPage('/a'+a.path);
                    return;
                }
            
            // Default

            if(startPage === '') {
                setStartPage('/a/orders');
            }

        }

    }

    useEffect(()=>{
      getStartPage();
    },[access])

    // Check access array

    const checkAccessArray = (path: string): boolean => {

        if(access?.length)
            if(access.find(a=>String(path).startsWith(a.path) && a.access===true))
              return true;
        
        return false;

    }

    // Check access

    const checkAccess = (path: string) => {
        
        if(access) {
        
            // Trim path
            
            path = path.replace(/^\/a/, '');
            
            // Check superuser
            
            if(checkAccessArray('_superuser'))
                return true;

            // Check access

            if(checkAccessArray(path))
                return true;

        }
        
        // Return false
        
        return false;
    }

    // Init provider

    const values = useMemo(
        () => ({
          access,
          startPage,
          checkAccess,
          getAccess
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
