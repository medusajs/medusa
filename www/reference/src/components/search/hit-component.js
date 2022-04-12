import React, { useContext } from "react"

import NavigationContext from "../../context/navigation-context"
import { convertToKebabCase } from "../../utils/convert-to-kebab-case"
import { navigate } from "gatsby"

const HitComponent = ({ hit, children, data }) => {
  const { goTo, api } = useContext(NavigationContext)
  let { url, type, hierarchy } = hit

  /** Get the API that is not currently being viewed, so we can create
   * an URL that goes to the other API.
   */
  const getOtherAPI = () => {
    if (api === "store") return "admin"
    if (api === "admin") return "store"
  }

  /** If result is part of currently viewed API then we scroll to the
   * concept/method, and update the pages metadata.
   */
  const goToHierarchy = e => {
    e.preventDefault()
    //find section
    let section = data.sections.find((s) => s.section.section_name == hierarchy.lvl1);
    section = section ? section.section : {}
    if (hierarchy.lvl2) {
      goTo({
        section: convertToKebabCase(hierarchy.lvl1),
        method: convertToKebabCase(hierarchy.lvl2),
        sectionObj: section
      })
    } else {
      goTo({ section: convertToKebabCase(hierarchy.lvl1), sectionObj: section })
    }
  }

  /** If result is NOT part of currently viewed API, but still a part of
   * the Gatsby site, then we use Gatsby's navigate function for improved
   * linking.
   */
  const navigateHierarchy = e => {
    e.preventDefault()
    if (hierarchy.lvl2) {
      navigate(
        `/api/${getOtherAPI()}/${convertToKebabCase(
          hierarchy.lvl1
        )}/${convertToKebabCase(hierarchy.lvl2)}`
      )
    } else {
      navigate(`/api/${getOtherAPI()}/${convertToKebabCase(hierarchy.lvl1)}`)
    }
  }

  /**
   * If result is part of the API reference then we want to strip
   * the #'s from the URL's. If the result is of LVL2 then we want
   * to add the LVL1 to the URL: '/store/#create-cart' -> '/store/cart/create-cart'
   */
  const formatURL = () => {
    url = url.replace("#", "/")
    if (type === "lvl2") {
      const index = url.lastIndexOf("/")
      url =
        url.substring(0, index) +
        `/${convertToKebabCase(hierarchy.lvl1)}` +
        url.substring(index)
    }
  }

  /**
   * If the result is part of the currently viewed API
   */
  if (url.includes(`api/${api}`)) {
    formatURL()
    return (
      <a href={url} onClick={goToHierarchy}>
        {children}
      </a>
    )
  }

  /**
   * If the result is NOT part of the currently viewed API
   */
  if (url.includes(`api/${getOtherAPI()}`)) {
    formatURL()
    return (
      <a href={url} onClick={navigateHierarchy}>
        {children}
      </a>
    )
  }

  /**
   * If the result is part of the Docasaurus docs
   */
  return <a href={url}>{children}</a>
}

export default HitComponent
