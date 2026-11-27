import { buildWorkflowManifest } from "../workflow-manifest"

const dir = "/app/src/workflows"

function build({
  workflowFiles = {},
  scheduled = [],
  hooks = [],
  configured = [],
}: {
  workflowFiles?: Record<string, string>
  scheduled?: string[]
  hooks?: { workflowId: string; file: string }[]
  configured?: string[]
}) {
  return buildWorkflowManifest({
    workflowFiles: new Map(Object.entries(workflowFiles)),
    scheduledWorkflows: new Set(scheduled),
    hookRegistrations: hooks,
    workflowDirs: [dir],
    hasFileConfig: (file) => configured.includes(file),
  })
}

describe("buildWorkflowManifest", () => {
  it("loads files defining workflows on first use", () => {
    const manifest = build({ workflowFiles: { a: `${dir}/a.js` } })

    expect(manifest.workflows).toEqual({ a: `${dir}/a.js` })
    expect(manifest.lazyWorkflowFiles).toEqual([`${dir}/a.js`])
  })

  it("loads files only registering hooks before the workflow runs", () => {
    const manifest = build({
      workflowFiles: { a: `${dir}/a.js` },
      hooks: [{ workflowId: "a", file: `${dir}/hooks.js` }],
    })

    expect(manifest.workflowHooks).toEqual({ a: [`${dir}/hooks.js`] })
    expect(manifest.lazyWorkflowFiles).toContain(`${dir}/hooks.js`)
  })

  it("doesn't map hooks a file registers on a workflow it defines", () => {
    const manifest = build({
      workflowFiles: { a: `${dir}/a.js` },
      hooks: [{ workflowId: "a", file: `${dir}/a.js` }],
    })

    expect(manifest.workflowHooks).toEqual({})
  })

  it("keeps hooks registered on other workflows by a file defining one", () => {
    const manifest = build({
      workflowFiles: { a: `${dir}/a.js`, b: `${dir}/b.js` },
      hooks: [{ workflowId: "b", file: `${dir}/a.js` }],
    })

    expect(manifest.workflowHooks).toEqual({ b: [`${dir}/a.js`] })
  })

  it("loads files defining scheduled workflows at boot", () => {
    const manifest = build({
      workflowFiles: { a: `${dir}/a.js` },
      scheduled: ["a"],
    })

    expect(manifest.workflows).toEqual({})
    expect(manifest.lazyWorkflowFiles).toEqual([])
    expect(manifest.kept).toEqual({ [`${dir}/a.js`]: "workflow: scheduled" })
  })

  it("keeps a scheduled workflow's file at boot when it also registers a hook on another workflow", () => {
    const manifest = build({
      workflowFiles: { a: `${dir}/a.js`, b: `${dir}/b.js` },
      scheduled: ["a"],
      hooks: [{ workflowId: "b", file: `${dir}/a.js` }],
    })

    expect(manifest.lazyWorkflowFiles).not.toContain(`${dir}/a.js`)
    expect(manifest.workflowHooks).toEqual({ b: [`${dir}/a.js`] })
    expect(manifest.kept).toEqual({ [`${dir}/a.js`]: "workflow: scheduled" })
  })

  it("loads configured files at boot, where they can be disabled", () => {
    const manifest = build({
      workflowFiles: { a: `${dir}/a.js` },
      hooks: [{ workflowId: "b", file: `${dir}/a.js` }],
      configured: [`${dir}/a.js`],
    })

    expect(manifest.workflows).toEqual({})
    expect(manifest.lazyWorkflowFiles).toEqual([])
    expect(manifest.workflowHooks).toEqual({})
    expect(manifest.kept).toEqual({
      [`${dir}/a.js`]: "workflow: has a file config",
    })
  })

  it("doesn't load files outside the workflow folders lazily", () => {
    const manifest = build({ workflowFiles: { a: "/app/src/lib/a.js" } })

    expect(manifest.workflows).toEqual({ a: "/app/src/lib/a.js" })
    expect(manifest.lazyWorkflowFiles).toEqual([])
  })
})
