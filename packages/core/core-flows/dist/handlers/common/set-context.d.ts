import { WorkflowArguments } from "@medusajs/workflows-sdk";
type ContextDTO = {
    context?: Record<any, any>;
};
declare enum Aliases {
    Context = "context"
}
type HandlerInputData = {
    context: {
        context?: Record<any, any>;
    };
};
export declare function setContext({ data, }: WorkflowArguments<HandlerInputData>): Promise<ContextDTO>;
export declare namespace setContext {
    var aliases: typeof Aliases;
}
export {};
