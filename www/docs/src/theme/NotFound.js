import React from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import {PageMetadata} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl'

export default function NotFound() {
  return (
    <>
      <PageMetadata
        title={translate({
          id: 'theme.NotFound.title',
          message: 'Page Not Found',
        })}
      />
      <Layout>
        <main className="container margin-vert--xl markdown theme-doc-markdown">
          <div className="row">
            <div className="col col--6 col--offset-3">
              <h1 className="hero__title">
                <Translate
                  id="theme.NotFound.title"
                  description="The title of the 404 page">
                  Page Not Found
                </Translate>
              </h1>
              <p>
                <Translate
                  id="theme.NotFound.p1"
                  description="The first paragraph of the 404 page">
                  Looks like the page you're looking for has either changed into a different
                  location or isn't in our documentation anymore.
                </Translate>
              </p>
              <p>
                If you think this is a mistake, please <a 
                  href="https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml"
                  rel="noopener noreferrer"
                  target="_blank"
                  className='link'
                >
                  report this issue on GitHub
                </a>
              </p>
              <h2>Some popular links</h2>
              <ul>
                <li>
                  <a href={useBaseUrl('/usage/create-medusa-app')}>Install Medusa with create-medusa-app</a>
                </li>
                <li>
                  <a href={useBaseUrl('/api/store')}>Storefront REST API Reference</a>
                </li>
                <li>
                  <a href={useBaseUrl('/api/admin')}>Admin REST API Reference</a>
                </li>
                <li>
                  <a href={useBaseUrl('/starters/nextjs-medusa-starter')}>Install Next.js Storefront</a>
                </li>
                <li>
                  <a href={useBaseUrl('/admin/quickstart')}>Install Medusa Admin</a>
                </li>
                <li>
                  <a href={useBaseUrl('/user-guide')}>User Guide</a>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
