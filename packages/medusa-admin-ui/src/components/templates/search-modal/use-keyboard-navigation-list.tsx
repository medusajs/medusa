import * as React from "react"

const offsetTopRelativeTo = (element, ancestor) => {
  const elementCoords = element.getBoundingClientRect()
  const ancestorCoords = ancestor.getBoundingClientRect()
  return Math.abs(elementCoords.top - ancestorCoords.top)
}

const useKeyboardNavigationList = ({ length = 0 }) => {
  const ulRef = React.useRef<HTMLUListElement | null>(null)
  const liRefs = React.useRef<Array<HTMLLIElement | null>>([])
  const [selected, setSelected] = React.useState({ index: 0, source: "hover" })
  const [pressed, setPressed] = React.useState(false)

  const getInputProps = () => {
    return {
      "aria-activedescendant": `result-item-${selected}`,
      "aria-controls": "results-list",
      onKeyDown: (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelected(({ index }) => ({
            index: index + 1 > length - 1 ? 0 : index + 1,
            source: "keyboard",
          }))
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelected(({ index }) => ({
            index: Math.max(index - 1, 0),
            source: "keyboard",
          }))
        }
      },
    }
  }

  const getLIProps = ({ index, ...props }) => {
    return {
      tabIndex: index,
      role: "option",
      id: `result-item-${index}`,
      key: index,
      "aria-selected": selected === index,
      ref: (el) => {
        liRefs.current[index] = el
      },
      onMouseEnter: (e) => {
        setSelected({ index, source: "hover" })
      },
      ...props,
    }
  }

  const getULProps = () => {
    return {
      tabIndex: 0,
      role: "listbox",
      id: "results-list",
      ref: ulRef,
    }
  }

  const enterHandler = (e) => {
    if (e.key === "Enter") {
      setPressed(true)
    }
  }

  React.useEffect(() => {
    if (pressed) {
      const child = liRefs.current[selected.index]
        ?.children[0] as HTMLAnchorElement
      child?.click()
    }
  }, [pressed, selected])

  React.useLayoutEffect(() => {
    if (selected.source === "hover") {
      return
    }
    const selectedLI = liRefs.current[selected.index]
    const ul = ulRef.current
    // if there is an overflow
    if (ul && selectedLI && ul.scrollHeight > ul.clientHeight) {
      const scrollBottom = ul.clientHeight + ul.scrollTop
      const elementBottom =
        offsetTopRelativeTo(selectedLI, ul) +
        ul?.scrollTop +
        selectedLI.offsetHeight
      const elementTop = selectedLI.offsetTop
      // scroll down if selected item is downward
      if (elementBottom > scrollBottom) {
        ul.scrollTop = elementBottom - ul.clientHeight
      }
      // scroll up if selected item is upward
      else if (elementTop < scrollBottom) {
        ul.scrollTop = Math.abs(ul.offsetTop - selectedLI.offsetTop)
      }
    }
  }, [selected])

  React.useEffect(() => {
    window.addEventListener("keydown", enterHandler)
    return () => {
      window.removeEventListener("keydown", enterHandler)
    }
  }, [])

  return {
    getInputProps,
    getLIProps,
    getULProps,
    selected: selected.index,
  } as const
}

export default useKeyboardNavigationList
