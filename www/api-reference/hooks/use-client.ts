import { useEffect, useState } from "react"

const useClient = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

export default useClient
