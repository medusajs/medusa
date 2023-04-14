import React, { useEffect, useState } from "react"
import { request } from "@octokit/request"
// import "./index.css"

type SolutionsProps = {
  feedback: boolean
  message?: string
}

type GitHubSearchItem = {
  url: string
  html_url: string
  title: string
  [key: string]: unknown
}

const Solutions: React.FC<SolutionsProps> = ({ feedback, message }) => {
  const [possibleSolutionsQuery, setPossibleSolutionsQuery] =
    useState<string>("")
  const [possibleSolutions, setPossibleSolutions] = useState<
    GitHubSearchItem[]
  >([])

  function constructQuery(searchQuery: string) {
    return `${searchQuery} repo:medusajs/medusa is:closed is:issue`
  }

  async function searchGitHub(query) {
    return request(`GET /search/issues`, {
      q: query,
      sort: "updated",
      per_page: 3,
    })
  }

  useEffect(() => {
    if (!feedback) {
      let query = constructQuery(
        // Github does not allow queries longer than 256 characters
        message ? message.substring(0, 256) : document.title
      )
      searchGitHub(query)
        .then(async (result) => {
          if (!result.data.items.length && message) {
            query = constructQuery(document.title)
            result = await searchGitHub(query)
          }

          setPossibleSolutionsQuery(query)
          setPossibleSolutions(result.data.items)
        })
        .catch((err) => console.error(err))
    } else {
      setPossibleSolutionsQuery("")
      setPossibleSolutions([])
    }
  }, [feedback])

  return (
    <>
      {possibleSolutions.length > 0 && (
        <div className="tw-text-label-large-plus tw-font-normal">
          <span className="tw-inline-block tw-my-1 tw-mx-0">
            If you faced a problem, here are some possible solutions from
            GitHub:
          </span>
          <ul>
            {possibleSolutions.map((solution) => (
              <li key={solution.url} className="tw-mb-0.5 last:tw-mb-0">
                <a href={solution.html_url} target="_blank" rel="noreferrer">
                  {solution.title}
                </a>
              </li>
            ))}
          </ul>
          <span>
            Explore more issues in{" "}
            <a
              href={`https://github.com/medusajs/medusa/issues?q=${possibleSolutionsQuery}`}
              target="_blank"
              rel="noreferrer"
            >
              the GitHub repository
            </a>
          </span>
        </div>
      )}
    </>
  )
}

export default Solutions
