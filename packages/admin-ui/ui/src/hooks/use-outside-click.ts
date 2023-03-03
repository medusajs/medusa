import { useEffect } from "react"

const useOutsideClick = (callback: () => void, ref: any) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current.contains(e.target)) {
        callback()
      }
    }

    document.addEventListener("click", handleClickOutside)

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [ref])
}

export default useOutsideClick
