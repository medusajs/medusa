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
        description: "Deploy your backend to your preferred hosting.",
        path: "/deployments/server",
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
        description:
          "Build a storefront either using the Next.js starter or from scratch.",
        path: "/starters/nextjs-medusa-starter",
      },
      {
        description:
          "Deploy your backend to the hosting provider of your choice.",
        path: "/deployments/server",
      },
    ],
  },
]

export const getLearningPaths = () => paths

export const getLearningPath = (
  pathName: string
): LearningPathType | undefined => paths.find((path) => path.name === pathName)
