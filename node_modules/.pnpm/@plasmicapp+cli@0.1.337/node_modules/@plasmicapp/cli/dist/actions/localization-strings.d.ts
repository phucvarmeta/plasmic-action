import { CommonArgs } from "..";
export interface LocalizationStringsArgs extends CommonArgs {
    host: string;
    projects: readonly string[];
    projectTokens?: readonly string[];
    format: "po" | "json" | "lingui";
    output: string;
    forceOverwrite: boolean;
    keyScheme: "content" | "hash" | "path" | undefined;
    tagPrefix: string | undefined;
    excludeDeps: boolean | undefined;
}
export declare function getLocalizationYargs(key: "key-scheme" | "tag-prefix"): {
    describe: string;
    type: "string";
    choices: string[];
} | {
    describe: string;
    type: "string";
    choices?: undefined;
};
export declare function localizationStrings(opts: LocalizationStringsArgs): Promise<void>;
