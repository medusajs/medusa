"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react"
import { BadgeProps } from "../../components/Badge"
import { Modal } from "../../components/Modal"
import { Search, SearchProps } from "../../components/Search"
import {
  liteClient as algoliasearch,
  LiteClient as SearchClient,
} from "algoliasearch/lite"
import clsx from "clsx"
// @ts-expect-error can't install the types package because it doesn't support React v19
import { CSSTransition, SwitchTransition } from "react-transition-group"

export type SearchCommand = {
  name: string
  component?: React.ReactNode
  action?: () => void
  icon?: React.ReactNode
  title: string
  badge?: BadgeProps
}

export type SearchContextType = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  searchClient: SearchClient
  commands: SearchCommand[]
  command: SearchCommand | null
  setCommand: React.Dispatch<React.SetStateAction<SearchCommand | null>>
  setCommands: React.Dispatch<React.SetStateAction<SearchCommand[]>>
  modalRef: React.RefObject<HTMLDialogElement | null>
  indices: AlgoliaIndex[]
  selectedIndex: string
  setSelectedIndex: (value: string) => void
}

const SearchContext = createContext<SearchContextType | null>(null)

export type AlgoliaIndex = {
  value: string
  title: string
}

export type AlgoliaProps = {
  appId: string
  apiKey: string
  mainIndexName: string
}

export type SearchProviderProps = {
  children: React.ReactNode
  indices: AlgoliaIndex[]
  defaultIndex: string
  algolia: AlgoliaProps
  searchProps: Omit<SearchProps, "algolia">
  commands?: SearchCommand[]
  modalClassName?: string
}

export const SearchProvider = ({
  children,
  defaultIndex: initialDefaultIndex,
  searchProps,
  algolia,
  commands: initialCommands = [],
  modalClassName,
  indices,
}: SearchProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] =
    useState<string>(initialDefaultIndex)
  const [commands, setCommands] = useState<SearchCommand[]>(initialCommands)
  const [command, setCommand] = useState<SearchCommand | null>(null)

  const modalRef = useRef<HTMLDialogElement | null>(null)

  const searchClient: SearchClient = useMemo(
    () => algoliasearch(algolia.appId, algolia.apiKey),
    [algolia.appId, algolia.apiKey]
  )

  useEffect(() => {
    if (initialDefaultIndex !== selectedIndex) {
      setSelectedIndex(initialDefaultIndex)
    }
  }, [initialDefaultIndex])

  const componentWrapperRef = useRef(null)

  useEffect(() => {
    command?.action?.()
  }, [command])

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        setIsOpen,
        searchClient,
        commands,
        command,
        setCommand,
        modalRef,
        setCommands,
        indices,
        selectedIndex,
        setSelectedIndex,
      }}
    >
      {children}
      <Modal
        contentClassName={clsx(
          "!p-0 overflow-hidden relative h-full",
          "flex flex-col justify-between"
        )}
        modalContainerClassName="!h-[95%] max-h-[95%] md:!h-[480px] md:max-h-[480px]"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        passedRef={modalRef}
        className={modalClassName}
      >
        <SwitchTransition>
          <CSSTransition
            classNames={{
              enter:
                command === null || !command.component
                  ? "animate-fadeInLeft animate-fast"
                  : "animate-fadeInRight animate-fast",
              exit:
                command === null || !command.component
                  ? "animate-fadeOutLeft animate-fast"
                  : "animate-fadeOutRight animate-fast",
            }}
            timeout={250}
            key={command?.component ? command.name : "search"}
            nodeRef={componentWrapperRef}
          >
            <div ref={componentWrapperRef} className="h-full">
              {!command?.component && (
                <Search {...searchProps} algolia={algolia} />
              )}
              {command?.component}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </Modal>
    </SearchContext.Provider>
  )
}

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error("useSearch must be used inside a SearchProvider")
  }

  return context
}
