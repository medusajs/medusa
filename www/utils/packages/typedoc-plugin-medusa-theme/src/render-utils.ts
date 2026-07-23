import * as fs from "fs"
import Handlebars from "handlebars"
import * as path from "path"
import breadcrumbsHelper from "./resources/helpers/breadcrumbs.js"
import commentHelper from "./resources/helpers/comment.js"
import commentsHelper from "./resources/helpers/comments.js"
import declarationTitleHelper from "./resources/helpers/declaration-title.js"
import escapeHelper from "./resources/helpers/escape.js"
import hierarchyHelper from "./resources/helpers/hierarchy.js"
import ifIsReference from "./resources/helpers/if-is-reference.js"
import ifNamedAnchors from "./resources/helpers/if-named-anchors.js"
import ifShowBreadcrumbsHelper from "./resources/helpers/if-show-breadcrumbs.js"
import ifShowNamedAnchorsHelper from "./resources/helpers/if-show-named-anchors.js"
import ifShowPageTitleHelper from "./resources/helpers/if-show-page-title.js"
import ifShowReturnsHelper from "./resources/helpers/if-show-returns.js"
import ifShowTypeHierarchyHelper from "./resources/helpers/if-show-type-hierarchy.js"
import indexSignatureTitleHelper from "./resources/helpers/index-signature-title.js"
import parameterTableHelper from "./resources/helpers/parameter-table.js"
import objectLiteralMemberHelper from "./resources/helpers/type-declaration-members.js"
import referenceMember from "./resources/helpers/reference-member.js"
import reflectionPathHelper from "./resources/helpers/reflection-path.js"
import reflectionTitleHelper from "./resources/helpers/reflection-title.js"
import relativeUrlHelper from "./resources/helpers/relative-url.js"
import returns from "./resources/helpers/returns.js"
import signatureTitleHelper from "./resources/helpers/signature-title.js"
import tocHelper from "./resources/helpers/toc.js"
import typeHelper from "./resources/helpers/type.js"
import typeAndParentHelper from "./resources/helpers/type-and-parent.js"
import typeParameterTableHelper from "./resources/helpers/type-parameter-table.js"
import sectionsHelper from "./resources/helpers/section-enabled.js"
import getFormattingOptionHelper from "./resources/helpers/get-formatting-option.js"
import titleLevelHelper from "./resources/helpers/title-level.js"
import typeParameterListHelper from "./resources/helpers/type-parameter-list.js"
import typeParameterHelper from "./resources/helpers/type-parameter.js"
import parameterListHelper from "./resources/helpers/parameter-list.js"
import parameterHelper from "./resources/helpers/parameter.js"
import debugHelper from "./resources/helpers/debug.js"
import frontmatterHelper from "./resources/helpers/frontmatter.js"
import reflectionDescriptionHelper from "./resources/helpers/reflection-description.js"
import mdxImportsHelper from "./resources/helpers/mdx-imports.js"
import parameterComponentHelper from "./resources/helpers/parameter-component.js"
import typeParameterComponentHelper from "./resources/helpers/type-parameter-component.js"
import showPropertiesAsComponentHelper from "./resources/helpers/show-properties-as-component.js"
import commentTagHelper from "./resources/helpers/comment-tag.js"
import exampleHelper from "./resources/helpers/example.js"
import ifFeatureFlagHelper from "./resources/helpers/if-feature-flag.js"
import featureFlagHelper from "./resources/helpers/feature-flag.js"
import decrementCurrentTitleLevelHelper from "./resources/helpers/decrement-current-title-level.js"
import incrementCurrentTitleLevelHelper from "./resources/helpers/increment-current-title-level.js"
import hasMoreThanOneSignatureHelper from "./resources/helpers/has-more-than-one-signature.js"
import ifCanShowConstructorsTitleHelper from "./resources/helpers/if-can-show-constructors-title.js"
import ifReactQueryTypeHelper from "./resources/helpers/if-react-query-type.js"
import ifHasHookParamsHelper from "./resources/helpers/if-has-hook-params.js"
import reactQueryHookParamsHelper from "./resources/helpers/react-query-hook-params.js"
import ifHasMutationParamsHelper from "./resources/helpers/if-has-mutation-params.js"
import reactQueryMutationParamsHelper from "./resources/helpers/react-query-mutation-params.js"
import ifHasMutationReturnHelper from "./resources/helpers/if-has-mutation-return.js"
import reactQueryMutationReturnHelper from "./resources/helpers/react-query-mutation-return.js"
import ifHasQueryReturnHelper from "./resources/helpers/if-has-query-return.js"
import reactQueryQueryReturnHelper from "./resources/helpers/react-query-query-return.js"
import endSectionsHelper from "./resources/helpers/end-sections.js"
import getDeclarationChildrenHelper from "./resources/helpers/get-declaration-children.js"
import ifShowSeparatorForTitleLevelHelper from "./resources/helpers/if-show-separator-for-title-level.js"
import shouldExpandPropertiesHelper from "./resources/helpers/should-expand-properties.js"
import shouldExpandDeclarationChildrenHelper from "./resources/helpers/should-expand-declaration-children.js"
import startSectionsHelper from "./resources/helpers/start-sections.js"
import ifDmlEntityHelper from "./resources/helpers/if-dml-entity.js"
import dmlPropertiesHelper from "./resources/helpers/dml-properties.js"
import ifWorkflowStepHelper from "./resources/helpers/if-workflow-step.js"
import stepInputHelper from "./resources/helpers/step-input.js"
import stepOutputHelper from "./resources/helpers/step-output.js"
import ifWorkflowHelper from "./resources/helpers/if-workflow.js"
import workflowInputHelper from "./resources/helpers/workflow-input.js"
import workflowOutputHelper from "./resources/helpers/workflow-output.js"
import workflowDiagramHelper from "./resources/helpers/workflow-diagram.js"
import workflowHooksHelper from "./resources/helpers/workflow-hooks.js"
import ifMemberShowTitleHelper from "./resources/helpers/if-member-show-title.js"
import signatureCommentHelper from "./resources/helpers/signature-comment.js"
import versionHelper from "./resources/helpers/version.js"
import sourceCodeLinkHelper from "./resources/helpers/source-code-link.js"
import workflowExamplesHelper from "./resources/helpers/workflow-examples.js"
import stepExamplesHelper from "./resources/helpers/step-examples.js"
import ifEventsReferenceHelper from "./resources/helpers/if-events-reference.js"
import eventsListingHelper from "./resources/helpers/events-listing.js"
import workflowEventsHelper from "./resources/helpers/workflow-events.js"
import getAllChildrenHelper from "./resources/helpers/get-all-children.js"
import reflectionBadgesHelper from "./resources/helpers/reflection-badges.js"
import workflowNotes from "./resources/helpers/workflow-notes.js"
import { MarkdownTheme } from "./theme.js"
import { getDirname } from "utils"

const __dirname = getDirname(import.meta.url)

const TEMPLATE_PATH = path.join(__dirname, "resources", "templates")

export const indexTemplate = Handlebars.compile(
  fs.readFileSync(path.join(TEMPLATE_PATH, "index.hbs")).toString()
)

export const reflectionTemplate = Handlebars.compile(
  fs.readFileSync(path.join(TEMPLATE_PATH, "reflection.hbs")).toString()
)

export const reflectionMemberTemplate = Handlebars.compile(
  fs.readFileSync(path.join(TEMPLATE_PATH, "reflection.member.hbs")).toString()
)

export function registerPartials() {
  const partialsFolder = path.join(__dirname, "resources", "partials")
  const partialFiles = fs.readdirSync(partialsFolder)
  partialFiles.forEach((partialFile) => {
    const partialName = path.basename(partialFile, ".hbs")
    const partialContent = fs
      .readFileSync(partialsFolder + "/" + partialFile)
      .toString()
    Handlebars.registerPartial(partialName, partialContent)
  })
}

export function registerHelpers(theme: MarkdownTheme) {
  breadcrumbsHelper(theme)
  commentHelper()
  commentsHelper()
  declarationTitleHelper(theme)
  escapeHelper()
  hierarchyHelper()
  ifIsReference()
  ifNamedAnchors(theme)
  ifShowBreadcrumbsHelper(theme)
  ifShowNamedAnchorsHelper(theme)
  ifShowPageTitleHelper(theme)
  ifShowReturnsHelper(theme)
  ifShowTypeHierarchyHelper()
  indexSignatureTitleHelper()
  parameterTableHelper()
  objectLiteralMemberHelper(theme)
  referenceMember()
  reflectionPathHelper()
  reflectionTitleHelper(theme)
  relativeUrlHelper(theme)
  returns(theme)
  signatureTitleHelper(theme)
  tocHelper(theme)
  typeHelper()
  typeAndParentHelper()
  typeParameterTableHelper()
  sectionsHelper(theme)
  getFormattingOptionHelper(theme)
  titleLevelHelper(theme)
  typeParameterListHelper()
  typeParameterHelper(theme)
  parameterListHelper()
  parameterHelper(theme)
  debugHelper()
  frontmatterHelper(theme)
  reflectionDescriptionHelper(theme)
  mdxImportsHelper(theme)
  parameterComponentHelper(theme)
  typeParameterComponentHelper(theme)
  showPropertiesAsComponentHelper(theme)
  commentTagHelper(theme)
  exampleHelper()
  ifFeatureFlagHelper()
  featureFlagHelper()
  decrementCurrentTitleLevelHelper(theme)
  incrementCurrentTitleLevelHelper(theme)
  hasMoreThanOneSignatureHelper(theme)
  ifCanShowConstructorsTitleHelper()
  ifReactQueryTypeHelper()
  ifHasHookParamsHelper()
  reactQueryHookParamsHelper()
  ifHasMutationParamsHelper(theme)
  reactQueryMutationParamsHelper(theme)
  ifHasMutationReturnHelper(theme)
  reactQueryMutationReturnHelper(theme)
  ifHasQueryReturnHelper(theme)
  reactQueryQueryReturnHelper(theme)
  endSectionsHelper(theme)
  getDeclarationChildrenHelper(theme)
  ifShowSeparatorForTitleLevelHelper(theme)
  shouldExpandPropertiesHelper(theme)
  shouldExpandDeclarationChildrenHelper(theme)
  startSectionsHelper(theme)
  ifDmlEntityHelper(theme)
  dmlPropertiesHelper()
  ifWorkflowStepHelper()
  stepInputHelper(theme)
  stepOutputHelper(theme)
  ifWorkflowHelper()
  workflowInputHelper(theme)
  workflowOutputHelper(theme)
  workflowDiagramHelper(theme)
  workflowHooksHelper(theme)
  ifMemberShowTitleHelper(theme)
  signatureCommentHelper()
  versionHelper()
  sourceCodeLinkHelper()
  workflowExamplesHelper()
  stepExamplesHelper()
  ifEventsReferenceHelper(theme)
  eventsListingHelper()
  workflowEventsHelper()
  getAllChildrenHelper(theme)
  reflectionBadgesHelper()
  workflowNotes()
}
