import React, { useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useLocation } from "react-router-dom"
import OSShortcut from "../atoms/os-shortcut"
import SearchIcon from "../fundamentals/icons/search-icon"
import SearchModal from "../templates/search-modal"

const SearchBar: React.FC = () => {
  const [showSearchModal, setShowSearchModal] = useState(false)
  const location = useLocation()

  const toggleSearch = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowSearchModal((show) => !show)
  }

  const closeModal = () => {
    setShowSearchModal(false)
  }

  useHotkeys("cmd+k", toggleSearch, {}, [])
  useHotkeys("ctrl+k", toggleSearch, {}, [])
  useHotkeys("/", toggleSearch, {}, [])

  useEffect(() => {
    closeModal()
  }, [location])

  return (
    <>
      <button
        onClick={() => setShowSearchModal(true)}
        className="px-small flex basis-1/2 items-center py-[6px]"
      >
        <SearchIcon className="text-grey-40" />
        <div className="ms-5">
          <OSShortcut macModifiers="⌘" winModifiers="Ctrl" keys="K" />
        </div>
        <span className="ms-xsmall text-grey-40 inter-base-regular">
          Search anything...
        </span>
      </button>
      {showSearchModal && <SearchModal handleClose={closeModal} />}
    </>
  )
}

export default SearchBar
