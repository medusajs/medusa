"use client"

import React, { useEffect, useState } from "react"
import { request } from "@octokit/request"
import { Link } from "@/components"

export type SolutionsProps = {
  feedback: boolean
  message?: string
}

export type GitHubSearchItem = {
  url: string
  html_url: string
  title: string
  [key: string]: unknown
}

export const Solutions = ({ feedback, message }: SolutionsProps) => {
  const [possibleSolutionsQuery, setPossibleSolutionsQuery] =
    useState<string>("")
  const [possibleSolutions, setPossibleSolutions] = useState<
    GitHubSearchItem[]
  >([])

  function constructQuery(searchQuery: string) {
    return `${searchQuery} repo:medusajs/medusa is:closed is:issue`
  }

  async function searchGitHub(query: string) {
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
  }, [feedback, message])

  return (
    <>
      {possibleSolutions.length > 0 && (
        <div className="text-compact-large-plus font-normal">
          <span className="my-docs_1 mx-0 inline-block">
            If you faced a problem, here are some possible solutions from
            GitHub:
          </span>
          <ul>
            {possibleSolutions.map((solution) => (
              <li key={solution.url} className="mb-docs_0.5 last:mb-0">
                <Link href={solution.html_url} target="_blank" rel="noreferrer">
                  {solution.title}
                </Link>
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
