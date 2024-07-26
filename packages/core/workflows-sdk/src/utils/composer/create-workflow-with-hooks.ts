import { hook } from "./hook"

type Hooks = {
  [hook: string]: (input: any) => any
}

type DefineHooks<THooks extends Hooks> = {
  [HookName in keyof THooks]: (hookHandler: THooks[HookName]) => void
}

export type UseHook<THooks extends Hooks> = (
  name: keyof THooks,
  data: Parameters<THooks[keyof THooks]>[0]
) => ReturnType<THooks[keyof THooks]>

/**
 * Wrap a workflow composer with hooks.
 * @param composer
 */
export function createWorkflowWithHooks<TWorkflow, THooks extends Hooks>(
  composer: (useHook: UseHook<THooks>) => TWorkflow
): TWorkflow & DefineHooks<THooks> {
  return composer(hook.bind(composer)) as any
}
