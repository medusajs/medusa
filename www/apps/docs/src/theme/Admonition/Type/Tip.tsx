import React from "react"
import clsx from "clsx"
import Translate from "@docusaurus/Translate"
import type { Props } from "@theme/Admonition/Type/Tip"
import AdmonitionLayout from "@theme/Admonition/Layout"
import IconTip from "@theme/Admonition/Icon/Tip"

const infimaClassName = "alert alert--success"

const defaultProps = {
  icon: <IconTip />,
  title: (
    <Translate
      id="theme.admonition.tip"
      description="The default label used for the Tip admonition (:::tip)"
    >
      Tip
    </Translate>
  ),
}

export default function AdmonitionTypeTip(props: Props): JSX.Element {
  return (
    <AdmonitionLayout
      {...defaultProps}
      {...props}
      className={clsx(infimaClassName, props.className)}
    >
      {props.children}
    </AdmonitionLayout>
  )
}
