import React from "react"
import clsx from "clsx"
import Translate from "@docusaurus/Translate"
import type { Props } from "@theme/NotFound/Content"
import useBaseUrl from "@docusaurus/useBaseUrl"

export default function NotFoundContent({ className }: Props): JSX.Element {
  return (
    <main
      className={clsx("container markdown theme-doc-markdown my-4", className)}
    >
      <div className="row">
        <div className="col col--6 col--offset-3">
          <h1>
            <Translate
              id="theme.NotFound.title"
              description="The title of the 404 page"
            >
              Page Not Found
            </Translate>
          </h1>
          <p>
            <Translate
              id="theme.NotFound.p1"
              description="The first paragraph of the 404 page"
            >
              Looks like the page you&apos;re looking for has either changed
              into a different location or isn&apos;t in our documentation
              anymore.
            </Translate>
          </p>
          <p>
            If you think this is a mistake, please{" "}
            <a
              href="https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml"
              rel="noopener noreferrer"
              target="_blank"
            >
              report this issue on GitHub
            </a>
          </p>
          <h2>Some popular links</h2>
          <ul>
            <li>
              <a href={useBaseUrl("/usage/create-medusa-app")}>
                Install Medusa with create-medusa-app
              </a>
            </li>
            <li>
              <a href="https://docs.medusajs.com/api/store">
                Storefront REST API Reference
              </a>
            </li>
            <li>
              <a href="https://docs.medusajs.com/api/admin">
                Admin REST API Reference
              </a>
            </li>
            <li>
              <a href={useBaseUrl("/starters/nextjs-medusa-starter")}>
                Install Next.js Storefront
              </a>
            </li>
            <li>
              <a href={useBaseUrl("/admin/quickstart")}>Install Medusa Admin</a>
            </li>
            <li>
              <a href={useBaseUrl("/user-guide")}>User Guide</a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
