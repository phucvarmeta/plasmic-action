import React from "react";
export type GlobalActionDict = Record<string, Function>;
export declare const GlobalActionsContext: React.Context<GlobalActionDict | undefined>;
export declare function GlobalActionsProvider(props: {
    contextName: string;
    children?: React.ReactNode;
    actions: GlobalActionDict;
}): React.JSX.Element;
export declare function useGlobalActions(): GlobalActionDict;
