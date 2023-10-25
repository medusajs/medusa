import axios from "axios"
import Client, { ClientArgs } from "./client"
import {
  FrameOffset,
  GetCommentsResult,
  GetComponentResult,
  GetComponentSetResult,
  GetFileComponentSetsResult,
  GetFileComponentsResult,
  GetFileNodesResult,
  GetFileResult,
  GetFileStylesResult,
  GetImageFillsResult,
  GetImageResult,
  GetProjectFilesResult,
  GetStyleResult,
  GetTeamComponentSetsResult,
  GetTeamComponentsResult,
  GetTeamProjectsResult,
  GetTeamStylesResult,
  GetVersionsResult,
  NodeType,
  PostCommentResult,
  Vector,
} from "./types"
import { encodeQuery } from "./utils"

type FigmaArgs = Omit<ClientArgs, "baseURL">

const FIGMA_BASE_URL = "https://api.figma.com/v1/"

class Figma {
  private _api: Client

  constructor({ accessToken, maxRetries = 3 }: FigmaArgs) {
    this._api = new Client({
      accessToken,
      baseURL: FIGMA_BASE_URL,
      maxRetries,
    })
  }

  /**
   * Get a resource by its URL.
   */
  async getResource(url: string) {
    const response = await axios.get(url)

    if (Math.floor(response.status / 100) !== 2) {
      throw response.statusText
    }

    return response.data
  }

  async getFile(
    file_key: string,
    options?: {
      /** A specific version ID to get. Omitting this will get the current version of the file */
      version?: string
      /** If specified, only a subset of the document will be returned corresponding to the nodes listed, their children, and everything between the root node and the listed nodes */
      ids?: string[]
      /** Positive integer representing how deep into the document tree to traverse. For example, setting this to 1 returns only Pages, setting it to 2 returns Pages and all top level objects on each page. Not setting this parameter returns all nodes */
      depth?: number
      /** Set to "paths" to export vector data */
      geometry?: "paths"
      /** A comma separated list of plugin IDs and/or the string "shared". Any data present in the document written by those plugins will be included in the result in the `pluginData` and `sharedPluginData` properties. */
      plugin_data?: string
      /** Set to returns branch metadata for the requested file */
      branch_data?: boolean
    }
  ): Promise<GetFileResult> {
    const queryString = options
      ? `?${encodeQuery({
          ...options,
          ids: options.ids && options.ids.join(","),
        })}`
      : ""

    return this._api.request("GET", `files/${file_key}${queryString}`)
  }

  async getFileNodes<TNode extends NodeType = "DOCUMENT">(
    file_key: string,
    options: {
      /** A comma separated list of node IDs to retrieve and convert */
      ids: string[]
      /** A specific version ID to get. Omitting this will get the current version of the file */
      version?: string
      /** Positive integer representing how deep into the document tree to traverse. For example, setting this to 1 returns only Pages, setting it to 2 returns Pages and all top level objects on each page. Not setting this parameter returns all nodes */
      depth?: number
      /** Set to "paths" to export vector data */
      geometry?: "paths"
      /** A comma separated list of plugin IDs and/or the string "shared". Any data present in the document written by those plugins will be included in the result in the `pluginData` and `sharedPluginData` properties. */
      plugin_data?: string
    }
  ): Promise<GetFileNodesResult<TNode>> {
    const queryString = `?${encodeQuery({
      ...options,
      ids: options.ids.join(","),
    })}`

    return this._api.request("GET", `files/${file_key}/nodes${queryString}`)
  }

  async getImage(
    file_key: string,
    options: {
      /** A comma separated list of node IDs to render */
      ids: string[]
      /** A number between 0.01 and 4, the image scaling factor */
      scale: number
      /** A string enum for the image output format */
      format: "jpg" | "png" | "svg" | "pdf"
      /** Whether to include id attributes for all SVG elements. `Default: false` */
      svg_include_id?: boolean
      /** Whether to simplify inside/outside strokes and use stroke attribute if possible instead of <mask>. `Default: true` */
      svg_simplify_stroke?: boolean
      /** Use the full dimensions of the node regardless of whether or not it is cropped or the space around it is empty. Use this to export text nodes without cropping. `Default: false` */
      use_absolute_bounds?: boolean
      /** A specific version ID to get. Omitting this will get the current version of the file */
      version?: string
    }
  ): Promise<GetImageResult> {
    const queryString = options
      ? `?${encodeQuery({
          ...options,
          ids: options.ids && options.ids.join(","),
        })}`
      : ""

    return this._api.request("GET", `images/${file_key}${queryString}`)
  }

  async getImageFills(file_key: string): Promise<GetImageFillsResult> {
    return this._api.request("GET", `files/${file_key}/images`)
  }

  async getComments(file_key: string): Promise<GetCommentsResult> {
    return this._api.request("GET", `files/${file_key}/comments`)
  }

  async postComment(
    file_key: string,
    /** The text contents of the comment to post */
    message: string,
    /** The position of where to place the comment. This can either be an absolute canvas position or the relative position within a frame. */
    client_meta: Vector | FrameOffset,
    /** (Optional) The comment to reply to, if any. This must be a root comment, that is, you cannot reply to a comment that is a reply itself (a reply has a parent_id). */
    comment_id?: string
  ): Promise<PostCommentResult> {
    return this._api.request("POST", `files/${file_key}/comments`, {
      message,
      client_meta,
      comment_id,
    })
  }

  async deleteComment(file_key: string, comment_id: string): Promise<void> {
    return this._api.request(
      "DELETE",
      `files/${file_key}/comments/${comment_id}`
    )
  }

  async getVersions(file_key: string): Promise<GetVersionsResult> {
    return this._api.request("GET", `files/${file_key}/versions`)
  }

  async getTeamProjects(teamId: string): Promise<GetTeamProjectsResult> {
    return this._api.request("GET", `teams/${teamId}/projects`)
  }

  async getProjectFiles(
    project_id: string,
    options: {
      /** Set to returns branch metadata for the requested file */
      branch_data?: boolean
    }
  ): Promise<GetProjectFilesResult> {
    const queryString = options
      ? `?${encodeQuery({
          ...options,
        })}`
      : ""

    return this._api.request(
      "GET",
      `projects/${project_id}/files${queryString}`
    )
  }

  /**
   * Get a paginated list of published components within a team library
   */
  async getTeamComponents(
    team_id: string,
    options: {
      /** Number of items in a paged list of results. Defaults to 30. */
      page_size?: number
      /** Cursor indicating which id after which to start retrieving components for. Exclusive with before. The cursor value is an internally tracked integer that doesn't correspond to any Ids */
      after?: number
      /** Cursor indicating which id before which to start retrieving components for. Exclusive with after. The cursor value is an internally tracked integer that doesn't correspond to any Ids */
      before?: number
    }
  ): Promise<GetTeamComponentsResult> {
    const queryString = options ? `?${encodeQuery(options)}` : ""

    return this._api.request("GET", `teams/${team_id}/components${queryString}`)
  }

  /**
   * Get a list of published components within a file library
   */
  async getFileComponents(file_key: string): Promise<GetFileComponentsResult> {
    return this._api.request("GET", `files/${file_key}/components`)
  }

  /**
   * Get metadata on a component by key.
   */
  async getComponent(component_key: string): Promise<GetComponentResult> {
    return this._api.request("GET", `components/${component_key}`)
  }

  /**
   * Get a paginated list of published component_sets within a team library
   */
  async getTeamComponentSets(
    team_id: string,
    options: {
      /** Number of items in a paged list of results. Defaults to 30. */
      page_size?: number
      /** Cursor indicating which id after which to start retrieving component sets for. Exclusive with before. The cursor value is an internally tracked integer that doesn't correspond to any Ids */
      after?: number
      /** Cursor indicating which id before which to start retrieving component sets for. Exclusive with after. The cursor value is an internally tracked integer that doesn't correspond to any Ids */
      before?: number
    }
  ): Promise<GetTeamComponentSetsResult> {
    const queryString = options ? `?${encodeQuery(options)}` : ""

    return this._api.request(
      "GET",
      `teams/${team_id}/component_sets${queryString}`
    )
  }

  async getFileComponentSets(
    file_key: string
  ): Promise<GetFileComponentSetsResult> {
    return this._api.request("GET", `files/${file_key}/component_sets`)
  }

  /**
   * Get metadata on a component_set by key.
   */
  async getComponentSet(key: string): Promise<GetComponentSetResult> {
    return this._api.request("GET", `component_sets/${key}`)
  }

  /**
   * Get a paginated list of published styles within a team library
   */
  async getTeamStyles(
    team_id: string,
    options: {
      /** Number of items in a paged list of results. Defaults to 30. */
      page_size?: number
      /** Cursor indicating which id after which to start retrieving styles for. Exclusive with before. The cursor value is an internally tracked integer that doesn't correspond to any Ids */
      after?: number
      /** Cursor indicating which id before which to start retrieving styles for. Exclusive with after. The cursor value is an internally tracked integer that doesn't correspond to any Ids */
      before?: number
    }
  ): Promise<GetTeamStylesResult> {
    const queryString = options ? `?${encodeQuery(options)}` : ""

    return this._api.request("GET", `teams/${team_id}/styles${queryString}`)
  }

  /**
   * Get a list of published styles within a file library
   */
  async getFileStyles(file_key: string): Promise<GetFileStylesResult> {
    return this._api.request("GET", `files/${file_key}/styles`)
  }

  /**
   * Get metadata on a style by key.
   */
  async getStyle(key: string): Promise<GetStyleResult> {
    return this._api.request("GET", `styles/${key}`)
  }

  // Variables - Beta API (TODO)

  // Webhooks - Beta API (TODO)

  // Activity Logs - Beta API (TODO)

  // Payments - Beta API (TODO)

  // Dev Resources - Beta API (TODO)
}

export * from "./assertions"
export * from "./types"

export default Figma
