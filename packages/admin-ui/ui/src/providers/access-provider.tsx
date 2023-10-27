import { useMedusa } from "medusa-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type accessType = {
  path: string,
  access: boolean
}

type AccessContextType = {
  access?: accessType[]
  checkAccess: (path: string) => boolean,
  getAccess: () => Promise<string>
}

export const AccessContext = createContext<AccessContextType | null>(null)

export const AccessProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {

  const { client: medusaClient } = useMedusa();
  const [access, setAccess] = useState<accessType[]>();
  
  // Get access
  
  const getAccess = async () : Promise<string> => {
    try{
      let res = await medusaClient.admin.custom.get('admin/access');
      setAccess(res.access || []);
      return getStartPage(res.access);
    }
    catch(e) {
      setAccess(undefined);
      return getStartPage();
    }
  }

  useEffect(()=>{
    if(!access)
      getAccess();
  },[])

  // Get start page

  const getStartPage = (access?: accessType[]) => {
          
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
            return '/a'+s;
          }
        }

        // Get first from access

        if(access?.length)
          for(let a of access)
            if(a.path !== '_superuser')
              return '/a'+a.path;
    
    }

    // Default

    return '/a/orders';

  }

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
