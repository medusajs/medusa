import { readFile, readdir } from "fs/promises"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import type { Documentation } from "react-docgen"

type ContextParams = {
  params: {
    name: string
  }
}

export async function GET(request: NextRequest, { params }: ContextParams) {
  // Ensure that vercel picks up the `specs` directory on build/deployment
  const mainSpecsDir = path.join(process.cwd(), "specs")
  const componentSpecsDir = path.join(mainSpecsDir, params.name)
  const specs: Documentation[] = []

  try {
    // retrieve spec files for specified component
    const specFiles = await readdir(componentSpecsDir)
    await Promise.all(
      specFiles.map(async (specFileName) => {
        // read spec file
        const specFile = await readFile(
          path.join(componentSpecsDir, specFileName),
          "utf-8"
        )
        specs.push(JSON.parse(specFile) as Documentation)
      })
    )
  } catch (e) {
    return NextResponse.json(
      {
        message: `Specs for ${params.name} not found.`,
      },
      {
        status: 404,
      }
    )
  }

  return NextResponse.json({
    specs,
  })
}
