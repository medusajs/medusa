"use client"

import React, { useEffect, useState } from "react"
import { Link } from "@/components/Link"
import { MDXComponents } from "@/components/MDXComponents"

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

const Ul = MDXComponents["ul"] as React.FC<
  React.HTMLAttributes<HTMLUListElement>
>
const Li = MDXComponents["li"] as React.FC<React.HTMLAttributes<HTMLLIElement>>

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
    return fetch(
      `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&sort=updated&per_page=3&advanced_search=true`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    ).then(async (res) => res.json() as Promise<{ items: GitHubSearchItem[] }>)
  }

  useEffect(() => {
    if (!feedback) {
      let query = constructQuery(
        // Github does not allow queries longer than 256 characters
        message ? message.substring(0, 256) : document.title
      )
      searchGitHub(query)
        .then(async (result) => {
          if (!result.items.length && message) {
            query = constructQuery(document.title)
            result = await searchGitHub(query)
          }

          setPossibleSolutionsQuery(query)
          setPossibleSolutions(result.items)
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
        <div className="txt-medium">
          <span className="my-docs_1 mx-0 inline-block">
            If you faced a problem, here are some possible solutions from
            GitHub:
          </span>
          <Ul>
            {possibleSolutions.map((solution) => (
              <Li key={solution.url} data-testid="solution-item">
                <Link
                  href={solution.html_url}
                  target="_blank"
                  rel="noreferrer"
                  variant="content"
                >
                  {solution.title}
                </Link>
              </Li>
            ))}
          </Ul>
          <span>
            Explore more issues in{" "}
            <Link
              href={`https://github.com/medusajs/medusa/issues?q=${possibleSolutionsQuery}`}
              target="_blank"
              rel="noreferrer"
              variant="content"
            >
              the GitHub repository
            </Link>
          </span>
        </div>
      )}
    </>
  )
}
