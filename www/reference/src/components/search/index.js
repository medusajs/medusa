import "../../medusa-plugin-themes/docsearch/theme.css"

import React, { useContext } from "react"

import { DocSearch } from "@docsearch/react"
import HitComponent from "./hit-component"
import NavigationContext from "../../context/navigation-context"
import { convertToKebabCase } from "../../utils/convert-to-kebab-case"
import { navigate } from "gatsby-link"

const algoliaApiKey = process.env.ALGOLIA_API_KEY || "temp"
const algoliaAppId = process.env.ALGOLIA_APP_ID || "temp"

const Search = ({data}) => {
  const { goTo, api } = useContext(NavigationContext)

  const getOtherAPI = () => {
    if (api === "store") return "admin"
    if (api === "admin") return "store"
  }

  const replaceUrl = item => {
    let { url, hierarchy } = item
    if (url.includes("api/store") || url.includes("/api/admin")) {
      url = url.replace("#", "")
      if (hierarchy.lvl2) {
        const index = url.lastIndexOf("/")
        url =
          url.substring(0, index) +
          `/${convertToKebabCase(hierarchy.lvl1)}` +
          url.substring(index)
      }
    }
    return url
  }

  /** If result is part of currently viewed API then we scroll to the
   * concept/method, and update the pages metadata.
   */
  const goToHierarchy = item => {
    const { hierarchy } = item
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
  const navigateHierarchy = item => {
    const { hierarchy } = item
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

  return (
    <DocSearch
      apiKey={algoliaApiKey}
      appId={algoliaAppId}
      indexName="medusa-commerce"
      hitComponent={({hit, children}) => <HitComponent data={data} hit={hit} children={children} />}
      navigator={{
        navigate({ item }) {
          if (item.url.includes(`api/${api}`)) {
            goToHierarchy(item)
          } else if (item.url.includes(`api/${getOtherAPI()}`)) {
            navigateHierarchy(item)
          } else {
            window.location = item.url
          }
        },

        navigateNewTab({ item }) {
          const url = replaceUrl(item)

          const windowReference = window.open(url, "_blank", "noopener")

          if (windowReference) {
            windowReference.focus()
          }
        },

        navigateNewWindow({ item }) {
          const url = replaceUrl(item)

          window.open(url, "_blank", "noopener")
        },
      }}
    />
  )
}

export default Search
