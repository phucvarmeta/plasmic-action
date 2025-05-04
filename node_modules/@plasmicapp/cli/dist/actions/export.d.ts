import { CommonArgs } from "..";
import { I18NConfig } from "../utils/config-utils";
export interface ExportArgs extends CommonArgs {
    projects: readonly string[];
    platform: "" | "react" | "nextjs" | "gatsby";
    codeLang: "" | "ts" | "js";
    styleScheme: "" | "css" | "css-modules";
    imagesScheme: "" | "inlined" | "files";
    i18NKeyScheme: "" | I18NConfig["keyScheme"];
    i18NTagPrefix: "" | I18NConfig["tagPrefix"];
    skipFormatting?: boolean;
    outDir: string;
}
export declare function exportProjectsCli(opts: ExportArgs): Promise<void>;
