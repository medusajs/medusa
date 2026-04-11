import { existsSync, readFileSync } from "fs"
import path from "path"
import {
  Application,
  Comment,
  CommentTag,
  Context,
  Converter,
  DeclarationReflection,
  ReferenceType,
} from "typedoc"
import { getDirname, getDmlProperties, isDmlEntity } from "utils"
import { DmlFile } from "types"

const FILE_NAME_REGEX = /packages\/modules\/(?<module>[a-z-]+)/
const SINCE_REGEX = /@since\s+([\d.]+)/
const DEPRECATED_REGEX = /@deprecated\s+(.+)/
const FEATURE_FLAG_REGEX = /@featureFlag\s+(\S+)/
const EXAMPLE_REGEX = /@example\s+([\s\S]+)/

export function load(app: Application) {
  app.converter.on(
    Converter.EVENT_CREATE_DECLARATION,
    getDescriptionsFromJson,
    2
  )
}

function getDescriptionsFromJson(
  context: Context,
  reflection: DeclarationReflection
) {
  if (!isDmlEntity(reflection)) {
    return
  }

  const dmlPropertyReflections = getDmlProperties(
    reflection.type as ReferenceType
  )

  if (!dmlPropertyReflections) {
    return
  }

  const fileName = context.project
    .getSymbolFromReflection(reflection)
    ?.valueDeclaration?.parent.getSourceFile().fileName

  if (!fileName) {
    return
  }

  const moduleName = FILE_NAME_REGEX.exec(fileName)

  if (!moduleName?.groups?.module) {
    return
  }

  const __dirname = getDirname(import.meta.url)

  const jsonFilePath = path.resolve(
    __dirname,
    path.join(
      "..",
      "..",
      "..",
      "generated",
      "dml-output",
      `${moduleName.groups.module}.json`
    )
  )

  if (!existsSync(jsonFilePath)) {
    return
  }

  const jsonFileContent = JSON.parse(
    readFileSync(jsonFilePath, "utf-8")
  ) as DmlFile

  if (!jsonFileContent[reflection.name]) {
    return
  }
  const comment = reflection.comment || new Comment()

  if (jsonFileContent[reflection.name].since) {
    comment.blockTags.push(
      new CommentTag("@since", [
        {
          kind: "text",
          text: jsonFileContent[reflection.name].since!,
        },
      ])
    )
  }

  if (jsonFileContent[reflection.name].deprecated?.is_deprecated) {
    comment.blockTags.push(
      new CommentTag("@deprecated", [
        {
          kind: "text",
          text: jsonFileContent[reflection.name].deprecated!.description || "",
        },
      ])
    )
  }

  if (jsonFileContent[reflection.name].featureFlag) {
    comment.blockTags.push(
      new CommentTag("@featureFlag", [
        {
          kind: "text",
          text: jsonFileContent[reflection.name].featureFlag!,
        },
      ])
    )
  }
  reflection.comment = comment

  Object.entries(jsonFileContent[reflection.name].properties).forEach(
    ([propertyName, description]) => {
      const propertyReflection = dmlPropertyReflections.find(
        (propertyRef) => propertyRef.name === propertyName
      )

      if (!propertyReflection) {
        return
      }

      const comment = propertyReflection.comment || new Comment()

      const isExpandable = description.includes("@expandable")
      const sinceMatch = description.match(SINCE_REGEX)
      const featureFlagMatch = description.match(FEATURE_FLAG_REGEX)
      const deprecatedMatch = description.match(DEPRECATED_REGEX)
      const exampleMatch = description.match(EXAMPLE_REGEX)

      comment.summary.push({
        kind: "text",
        text: description
          .replace("@expandable", "")
          .replace(SINCE_REGEX, "")
          .replace(FEATURE_FLAG_REGEX, "")
          .replace(DEPRECATED_REGEX, "")
          .replace(EXAMPLE_REGEX, "")
          .trim(),
      })

      if (isExpandable) {
        comment.modifierTags.add("@expandable")
      }

      if (sinceMatch) {
        comment.blockTags.push(
          new CommentTag("@since", [
            {
              kind: "text",
              text: sinceMatch[1],
            },
          ])
        )
      }

      if (featureFlagMatch) {
        comment.blockTags.push(
          new CommentTag("@featureFlag", [
            {
              kind: "text",
              text: featureFlagMatch[1],
            },
          ])
        )
      }

      if (deprecatedMatch) {
        comment.blockTags.push(
          new CommentTag("@deprecated", [
            {
              kind: "text",
              text: deprecatedMatch[1],
            },
          ])
        )
      }

      if (exampleMatch) {
        comment.blockTags.push(
          new CommentTag("@example", [
            {
              kind: "text",
              text: exampleMatch[1],
            },
          ])
        )
      }

      propertyReflection.comment = comment
    }
  )
}
