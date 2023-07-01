import React from "react"
import { LearningPathType } from "../providers/LearningPath"
import Link from "@docusaurus/Link"

const paths: LearningPathType[] = [
  {
    name: "simple-quickstart",
    label: "Start Selling in 3 Steps",
    description: "Create and deploy a full-fledged ecommerce store.",
    steps: [
      {
        title: "Create a Next.js storefront",
        description:
          "Create a Next.js storefront and connect it to your Medusa backend.",
        path: "/starters/nextjs-medusa-starter",
      },
      {
        title: "Deploy the backend",
        path: "/deployments/server/deploying-on-railway",
        descriptionJSX: (
          <>
            Deploy your backend to Railway. You can alternatively check out{" "}
            <Link href="/deployments/server">other deployment guides</Link>
          </>
        ),
      },
      {
        title: "Deploy the storefront",
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
    description:
      "Customize the backend and handle events to build a marketplace.",
    steps: [
      {
        title: "Extend entities",
        descriptionJSX: (
          <>
            Extend entities, such as <code>User</code> or <code>Product</code>{" "}
            entites, to associate them with the <code>Store</code> entity.
          </>
        ),
        path: "/development/entities/extend-entity",
      },
      {
        title: "Access logged-in user",
        description:
          "Create a middleware that registers the logged-in user in the dependency container.",
        path: "/development/endpoints/example-logged-in-user",
      },
      {
        title: "Extend services",
        descriptionJSX: (
          <>
            Extend services, such as <code>ProductService</code> to customize
            data management functionalities
          </>
        ),
        path: "/development/services/extend-service",
      },
      {
        title: "Handle events",
        descriptionJSX: (
          <>
            Listen to events like <code>order.placed</code> and handle them with
            subscribers
          </>
        ),
        path: "/development/events/create-subscriber",
      },
      {
        title: "Add Payment Provider",
        path: "/plugins/payment",
        descriptionJSX: (
          <>
            Add a payment provider to your Medusa backend. You can choose to
            install a plugin or{" "}
            <Link href="/modules/carts-and-checkout/backend/add-payment-provider">
              create your own provider
            </Link>
            .
          </>
        ),
      },
      {
        title: "Create a storefront",
        path: "/starters/nextjs-medusa-starter",
        descriptionJSX: (
          <>
            Build a storefront either using the Next.js starter or{" "}
            <Link href="/storefront/roadmap">from scratch</Link>.
          </>
        ),
      },
      {
        title: "Deploy the backend",
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
    description:
      "Customize the backend and handle events to implement subscriptions",
    steps: [
      {
        title: "Extend entities",
        path: "/development/entities/extend-entity",
        descriptionJSX: (
          <>
            Extend entities, such as the <code>Order</code> entity, to associate
            them with the <code>Store</code> entity. You can also{" "}
            <Link href="/development/entities/create">
              Create a custom entity
            </Link>
            .
          </>
        ),
      },
      {
        title: "Handle events",
        descriptionJSX: (
          <>
            Create a subscriber that listens to the <code>order.placed</code>{" "}
            event, or other{" "}
            <Link href="/development/events/events-list">events</Link>, and
            handles creating the subscription in Medusa.
          </>
        ),
        path: "/development/events/create-subscriber",
      },
      {
        title: "Create a Scheduled Job",
        description:
          "Create a scheduled job that checks daily for subscriptions that needs renewal.",
        path: "/development/scheduled-jobs/create",
      },
      {
        title: "Create a storefront",
        path: "/starters/nextjs-medusa-starter",
        descriptionJSX: (
          <>
            Build a storefront either using the Next.js starter or{" "}
            <Link href="/storefront/roadmap">from scratch</Link>.
          </>
        ),
      },
      {
        title: "Deploy the backend",
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
