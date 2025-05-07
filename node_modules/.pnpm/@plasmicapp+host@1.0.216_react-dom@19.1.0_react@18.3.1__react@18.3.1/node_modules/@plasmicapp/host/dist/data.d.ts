import React, { ReactNode } from "react";
export type DataDict = Record<string, any>;
export declare const DataContext: React.Context<DataDict | undefined>;
export type DataMeta = {
    advanced?: boolean;
    hidden?: boolean;
    label?: string;
};
export declare function mkMetaName(name: string): string;
export declare function mkMetaValue(meta: Partial<DataMeta>): DataMeta;
export declare function applySelector(rawData: DataDict | undefined, selector: string | undefined): any;
export type SelectorDict = Record<string, string | undefined>;
export declare function useSelector(selector: string | undefined): any;
export declare function useSelectors(selectors?: SelectorDict): any;
export declare function useDataEnv(): DataDict | undefined;
export interface DataProviderProps {
    /**
     * Key to set in data context.
     */
    name?: string;
    /**
     * Value to set for `name` in data context.
     */
    data?: any;
    /**
     * If true, hide this item in studio data picker.
     */
    hidden?: boolean;
    /**
     * If true, mark this item as advanced in studio.
     */
    advanced?: boolean;
    /**
     * Label to be shown in the studio data picker for easier navigation (data binding).
     */
    label?: string;
    children?: ReactNode;
}
export declare function DataProvider({ name, data, hidden, advanced, label, children, }: DataProviderProps): React.JSX.Element;
export interface PageParamsProviderProps {
    children?: ReactNode;
    /**
     * Page route without params substituted (e.g. /products/[slug]).
     */
    route?: string;
    /**
     * Page params (e.g. { slug: "jacket" })
     */
    params?: Record<string, string | string[] | undefined>;
    /**
     * Page query params (e.g. { q: "search term" })
     */
    query?: Record<string, string | string[] | undefined>;
    /**
     * @deprecated Use `route` instead.
     */
    path?: string;
}
export declare function PageParamsProvider({ children, route, path: deprecatedRoute, params, query, }: PageParamsProviderProps): React.JSX.Element;
export declare function DataCtxReader({ children, }: {
    children: ($ctx: DataDict | undefined) => ReactNode;
}): React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
