import { useRef, useState } from "react"

export const useHandleTableScroll = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // Listen for if the table container that has overflow-y: auto is scrolled, and if true set some state
  const [isScrolled, setIsScrolled] = useState(false)

  const handleScroll = () => {
    if (tableContainerRef.current) {
      setIsScrolled(
        tableContainerRef.current.scrollTop > 0 &&
          tableContainerRef.current.scrollTop <
            tableContainerRef.current.scrollHeight
      )
    }
  }

  return {
    tableContainerRef,
    isScrolled,
    handleScroll,
  }
}
