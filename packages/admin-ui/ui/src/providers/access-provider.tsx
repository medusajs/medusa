import { useMedusa } from "medusa-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type accessType = {
  path: string,
  access: boolean
}

type AccessContextType = {
  access?: accessType[]
  startPage?: string
  loaded?: boolean
  checkAccess: (path: string) => boolean,
  getAccess: () => Promise<boolean>
}

export const AccessContext = createContext<AccessContextType | null>(null)

export const AccessProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {

  const { client: medusaClient } = useMedusa();
  
  const [access, setAccess] = useState<accessType[]>();
  const [startPage, setStartPage] = useState<string>();
  const [loaded, setLoaded] = useState<boolean>(false);
  
  // Get access
  
  const getAccess = async (): Promise<boolean> => {
    setLoaded(false);
    try{
      let res = await medusaClient.admin.custom.get('admin/access');
      setAccess(res.access || []);
      setLoaded(true);
      return true;
    }
    catch(e) {
      setAccess(undefined);
      setLoaded(true);
      return false;
    }
  }

  useEffect(()=>{
    getAccess();
  },[])

  // Get start page

  useEffect(()=>{
    getStartPage();
  },[loaded])

  const getStartPage = () => {

    if(loaded) {
       
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

          // Get first from access

          if(access?.length)
            for(let a of access)
              if(a.path !== '_superuser') {
                setStartPage('/a'+a.path);
                return;
              }

      }

      // Default

      setStartPage('/a/orders');
      return;

    }
    else {
      setStartPage(undefined);
      return;
    }

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
      getAccess,
      access,
      startPage,
      loaded,
      checkAccess
    }),
    [getAccess, access, startPage, loaded, checkAccess]
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
