import { Application, PageEvent, ParameterType, Renderer, RendererEvent } from "typedoc";
import MarkdownIt from "markdown-it"
import Token from "markdown-it/lib/token";
import path from "path";
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "fs";
import { globSync } from "glob";
import { EOL } from "os";

declare module "typedoc" {
  export interface TypeDocOptionMap {
    filesToExpandLinks: string[];
  }
}

type LinkTokens = {
  start: Token
  content: Token
  end: Token
  hasSiblings: boolean
}

export function load (app: Application) {
  app.options.addDeclaration({
      name: "filesToExpandLinks",
      help: "List the files whose containing links should be expanded.",
      type: ParameterType.Array,
  });

  // app.renderer.on(PageEvent.END, (page: PageEvent) => {
  //   const filesToExpand = app.options.getValue("filesToExpandLinks") || []
  //   if (page.contents && isFileIncluded(filesToExpand, page.filename)) {
  //     const md = new MarkdownIt()
  //     const parsedContent = md.parse(page.contents, {})
  //     parsedContent.forEach((item) => {
  //       const links = findLinks(item)
  //       links.forEach((link) => {
  //         const href = link.start.attrGet("href") || ""
  //         const filePath = path.join(page.filename, "..", href)
  //         console.log("file exists", filePath, existsSync(filePath))
  //       })
  //     })
  //   }
  // });
  app.renderer.on(Renderer.EVENT_END, (rendererEvent: RendererEvent) => {
    const filesToExpand = app.options.getValue("filesToExpandLinks") || []
    // read files in the output directory
    const files = globSync(getFilesPatterns(filesToExpand, `${rendererEvent.outputDirectory}/**`))
    files.forEach((file) => {
      // get content
      let fileContent = readFileSync(file, "utf-8")
      let wasModified = false
      const md = new MarkdownIt()
      const parsedContent = md.parse(fileContent, {})
      parsedContent.forEach((item) => {
        const links = findLinks(item)
        links.forEach((link) => {
          const href = (link.start.attrGet("href") || "").replace(/#.*$/, "")
          const filePath = path.join(file, "..", href)
          if (!existsSync(filePath)) {
            return
          }
          const { importStr, replacement } = getImportAndReplacement(link, href)
          if (fileContent.indexOf(importStr) === -1) {
            fileContent = `${importStr}${EOL}${EOL}${fileContent}`
          }
          fileContent = fileContent.replaceAll(formatLink(link), replacement)
          wasModified = true
        })
      })
      // console.log(file, fileContent)
      // writeFileSync(file, fileContent)
      writeFileSync(`${file}x`, fileContent)
      rmSync(file)
    })
  })
}

function findLinks (item: Token): LinkTokens[] {
  const links: LinkTokens[] = []
  const itemsLength = item.children?.length || 0
  item.children?.forEach((token, index) => {
    if (token.type === "link_open" && itemsLength > index + 2) {
      // exclude external links
      const href = token.attrGet("href") || ""
      if (href.length && !isExternalUrl(href)) {
        // console.log("parent", item)
        links.push({
          start: token,
          content: item.children?.[index + 1] as Token,
          end: item.children?.[index + 2] as Token,
          hasSiblings: itemsLength > index + 3
        })
      }
    } else {
      const childLinks = findLinks(token)
      if (childLinks.length) {
        links.push(...childLinks)
      }
    }
  })

  return links
}

function formatLink (link: LinkTokens): string {
  let content = link.content.content
  switch (link.content.type) {
    case "code_inline":
      content = "`" + content + "`"
  }
  return `[${content}](${link.start.attrGet("href") || ""})`
}

function getFilesPatterns (files: string[], prefix: string) {
  return files.map((file) => {
    return `${prefix}/${file}.md`
  })
}

function isExternalUrl (url: string): boolean {
  return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(url)
}

type FormatSectionAsType = "details" | "dialog"

function getImportAndReplacement (link: LinkTokens, importPath: string): {
  importStr: string,
  replacement: string,
} {
  const componentName = link.content.content.charAt(0).toUpperCase() + link.content.content.substring(1)
  const importStr = `import ${componentName} from "${importPath}"`
  const replacement = `${EOL}<details><summary>${link.content.content}</summary><${componentName} /></details>`
  return {
    importStr,
    replacement
  }
}

function formatSection (link: LinkTokens, replacement: string, as: FormatSectionAsType = "details") {
  // restructure headings
  const formattedReplacement = replacement.replaceAll(/(#|##|###|####|#####|######) (.*)/g, "**$2**")
  switch (as) {
    case 'details':
      return `${EOL}
        <details>
        <summary>${EOL}
        ${link.content.content}
        </summary>${EOL}
        ${formattedReplacement}
        ${EOL}</details>${EOL}
      `
    case 'dialog':
      return `
        <dialog>${EOL}
        ${formattedReplacement}${EOL}
        </dialog>
      `
  }
}

// type Options = {
//   filesToExpandLinks: string[]
// }

// export class ConvertLinkToSectionPlugin {
//   private options: Options = {
//     filesToExpandLinks: []
//   }

//   init (app: Application) {
//     app.options.addDeclaration({
//       name: "filesToExpandLinks",
//       help: "List the files whose containing links should be expanded.",
//       type: ParameterType.Array,
//       default: []
//     });

//     app.converter.on()
//   }
// }