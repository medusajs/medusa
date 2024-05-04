import { RenderPromptProps } from "./render-prompt";
type UsePromptProps = Omit<RenderPromptProps, "onConfirm" | "onCancel" | "open">;
declare const usePrompt: () => (props: UsePromptProps) => Promise<boolean>;
export { usePrompt };
