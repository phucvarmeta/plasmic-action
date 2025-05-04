import { CommonArgs } from "..";
export interface FixImportsArgs extends CommonArgs {
    skipFormatting?: boolean;
}
export declare function fixImports(opts: FixImportsArgs): Promise<void>;
