import { useEffect } from "react"

export const useHighlightSearch = (name: string, query: string) => {
  function getHighlightedSearch(text: string) {
    const parts = text.split(new RegExp(`(${query})`, "gi"))

    const str: string[] = []

    for (const part of parts) {
      if (part.toLowerCase() === query.toLowerCase()) {
        str.push(`<mark class="bg-orange-10">${part}</mark>`)
      } else {
        str.push(part)
      }
    }

    return str.join("")
  }

  useEffect(() => {
    const children = document.getElementsByName(name)

    if (children) {
      const childArray = Array.from(children)
      for (const child of childArray) {
        child.innerHTML = child.innerHTML.replace(
          child.innerHTML,
          getHighlightedSearch(child.innerText)
        )
      }
    }
  }, [query, name])
}
