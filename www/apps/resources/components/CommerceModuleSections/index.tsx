"use client"

import { Hr, useChildDocs } from "docs-ui"
import React from "react"

export const CommerceModuleSections = () => {
  const guideComponents: (JSX.Element | JSX.Element[])[] = []
  const referenceComponents: (JSX.Element | JSX.Element[])[] = []

  const { items: serverGuideItems, component: serverGuidesComponent } =
    useChildDocs({
      showItems: ["Server Guides"],
      defaultItemsPerRow: 2,
    })
  if (serverGuideItems?.length) {
    guideComponents.push(serverGuidesComponent)
  }
  const { items: storefrontGuideItems, component: storefrontGuidesComponent } =
    useChildDocs({
      showItems: ["Storefront Guides"],
      defaultItemsPerRow: 2,
    })
  if (storefrontGuideItems?.length) {
    guideComponents.push(storefrontGuidesComponent)
  }
  const { items: adminGuideItems, component: adminGuidesComponent } =
    useChildDocs({
      showItems: ["Admin Guides"],
      defaultItemsPerRow: 2,
    })
  if (adminGuideItems?.length) {
    guideComponents.push(adminGuidesComponent)
  }
  const { items: userGuideItems, component: userGuidesComponent } =
    useChildDocs({
      showItems: ["Merchant Guides"],
      defaultItemsPerRow: 2,
    })
  if (userGuideItems?.length) {
    guideComponents.push(userGuidesComponent)
  }
  const { items: jsSdkItems, component: jsSdkComponent } = useChildDocs({
    showItems: ["JS SDK"],
    itemsPerRow: 2,
  })
  if (jsSdkItems?.length) {
    referenceComponents.push(jsSdkComponent)
  }
  const { items: referenceItems, component: referencesComponent } =
    useChildDocs({
      showItems: ["References"],
      defaultItemsPerRow: 2,
    })
  if (referenceItems?.length) {
    referenceComponents.push(referencesComponent)
  }

  return (
    <>
      {guideComponents.map((component, i) => (
        <React.Fragment key={i}>
          <>
            {i !== 0 && <Hr />}
            {component}
          </>
        </React.Fragment>
      ))}
      {guideComponents.length > 0 && referenceComponents.length > 0 && <Hr />}
      {referenceComponents.map((component, i) => (
        <React.Fragment key={i}>
          <>
            {i !== 0 && <Hr />}
            {component}
          </>
        </React.Fragment>
      ))}
    </>
  )
}
