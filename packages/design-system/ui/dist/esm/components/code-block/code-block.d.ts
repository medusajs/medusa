import * as React from "react";
export type CodeSnippet = {
    /**
     * The label of the code snippet's tab.
     */
    label: string;
    /**
     * The language of the code snippet. For example, `tsx`.
     */
    language: string;
    /**
     * The code snippet.
     */
    code: string;
    /**
     * Whether to hide the line numbers shown as the side of the code snippet.
     */
    hideLineNumbers?: boolean;
    /**
     * Whether to hide the copy button.
     */
    hideCopy?: boolean;
};
type RootProps = {
    snippets: CodeSnippet[];
};
type HeaderProps = {
    hideLabels?: boolean;
};
declare const CodeBlock: {
    ({ snippets, className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & RootProps): React.JSX.Element;
    displayName: string;
} & {
    Body: {
        ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
        displayName: string;
    };
    Header: {
        ({ children, className, hideLabels, ...props }: React.HTMLAttributes<HTMLDivElement> & HeaderProps): React.JSX.Element;
        displayName: string;
    } & {
        Meta: {
            ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
            displayName: string;
        };
    };
    Meta: {
        ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
        displayName: string;
    };
};
export { CodeBlock };
