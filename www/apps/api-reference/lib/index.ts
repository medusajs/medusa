"use server"

import { Area, ExpandedDocument } from "../types/openapi"

const URL = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PATH}`

export async function getBaseSpecs(area: Area) {
  try {
    const res = await fetch(`${URL}/base-specs?area=${area}`, {
      next: {
        revalidate: 3000,
        tags: [area],
      },
    }).then(async (res) => res.json())

    return res as ExpandedDocument
  } catch (e) {
    console.error(e)
  }
}
