import { useEffect } from "react"

const useOutsideClick = (callback: () => void, ref: any, capture = false) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current.contains(e.target)) {
        callback()
      }
    }

    document.addEventListener("click", handleClickOutside, capture)

    return () => {
      document.removeEventListener("click", handleClickOutside, capture)
    }
  }, [callback, ref, capture])
}

export default useOutsideClick
