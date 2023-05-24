import { LearningPath } from "../providers/LearningPath"

const paths: LearningPath[] = [
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
  },
]

export const getLearningPaths = () => paths

export const getLearningPath = (pathName: string) =>
  paths.find((path) => path.name === pathName)
