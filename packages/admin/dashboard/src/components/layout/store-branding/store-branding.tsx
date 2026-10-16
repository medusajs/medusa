import { Helmet } from "react-helmet-async"

import { useStore } from "../../../hooks/api/store"
import { DocumentTitle } from "../../../hooks/use-document-title"

/**
 * Brands the authenticated admin with the active store: the store name is
 * used as the document title suffix, and the store logo, when set, as the
 * favicon. Falls back to the Medusa defaults while the store is loading or
 * when it cannot be retrieved.
 */
export const StoreBranding = () => {
  const { store } = useStore()

  return (
    <>
      <DocumentTitle brand={store?.name} />
      {store?.logo_url && (
        <Helmet>
          <link rel="icon" href={store.logo_url} />
        </Helmet>
      )}
    </>
  )
}
