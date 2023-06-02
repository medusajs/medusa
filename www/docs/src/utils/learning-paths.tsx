import React from "react"
import { LearningPathType } from "../providers/LearningPath"
import Link from "@docusaurus/Link"

const paths: LearningPathType[] = [
  {
    name: "simple-quickstart",
    label: "Start Selling in 3 Steps",
    steps: [
      {
        description:
          "Create a Next.js storefront and connect it to your Medusa backend.",
        path: "/starters/nextjs-medusa-starter",
      },
      {
        path: "/deployments/server/deploying-on-railway",
        descriptionJSX: (
          <>
            Deploy your backend to Railway. You can alternatively check out{" "}
            <Link href="/deployments/server">other deployment guides</Link>
          </>
        ),
      },
      {
        description: "Deploy your storefront to your preferred hosting.",
        path: "/deployments/storefront",
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on building your store!",
        description: "Please rate your experience using this learning path.",
        eventName: "rating_path_simple-quickstart",
      },
    },
  },
  {
    name: "marketplace",
    label: "Build a marketplace",
    steps: [
      {
        description: "Extend entities to associate them with the Store",
        path: "/development/entities/extend-entity",
      },
      {
        description: "Access logged-in user using a middleware",
        path: "/development/endpoints/example-logged-in-user",
      },
      {
        description:
          "Extend services to customize data management functionalities",
        path: "/development/services/extend-service",
      },
      {
        description: "Listen and handle events with subscribers",
        path: "/development/events/create-subscriber",
      },
      {
        path: "/plugins/payment",
        descriptionJSX: (
          <>
            Add a payment provider. You can choose to install a plugin or{" "}
            <Link href="/modules/carts-and-checkout/backend/add-payment-provider">
              create your own provider
            </Link>
            .
          </>
        ),
      },
      {
        path: "/starters/nextjs-medusa-starter",
        descriptionJSX: (
          <>
            Build a storefront either using the Next.js starter or{" "}
            <Link href="/storefront/roadmap">from scratch</Link>.
          </>
        ),
      },
      {
        path: "/deployments/server/deploying-on-railway",
        descriptionJSX: (
          <>
            Deploy your backend to Railway. You can alternatively check out{" "}
            <Link href="/deployments/server">other deployment guides</Link>
          </>
        ),
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on building your marketplace!",
        description: "Please rate your experience using this learning path.",
        eventName: "rating_path_marketplace",
      },
    },
  },
  {
    name: "subscriptions",
    label: "Build Subscription-based Purchases",
    steps: [
      {
        path: "/development/entities/extend-entity",
        descriptionJSX: (
          <>
            Extend entities to associate them with the Store. You can also{" "}
            <Link href="/development/entities/create">
              Create a custom entity
            </Link>
            .
          </>
        ),
      },
      {
        description:
          "Create a subscriber that listens to the order.placed event and handles creating the subscription in Medusa.",
        path: "/development/events/create-subscriber",
      },
      {
        description:
          "Create a scheduled job that checks daily for subscriptions that needs renewal.",
        path: "/development/scheduled-jobs/create",
      },
      {
        path: "/starters/nextjs-medusa-starter",
        descriptionJSX: (
          <>
            Build a storefront either using the Next.js starter or{" "}
            <Link href="/storefront/roadmap">from scratch</Link>.
          </>
        ),
      },
      {
        path: "/deployments/server/deploying-on-railway",
        descriptionJSX: (
          <>
            Deploy your backend to Railway. You can alternatively check out{" "}
            <Link href="/deployments/server">other deployment guides</Link>
          </>
        ),
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on implementing subscription-based purchases!",
        description: "Please rate your experience using this learning path.",
        eventName: "rating_path_subscriptions",
      },
    },
  },
]

export const getLearningPaths = () => paths

export const getLearningPath = (
  pathName: string
): LearningPathType | undefined => paths.find((path) => path.name === pathName)
