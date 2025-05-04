import { CommonArgs } from "..";
export interface InfoArgs extends CommonArgs {
    projects: readonly string[];
    json?: boolean;
    host?: string;
}
export declare function printProjectInfo(opts: InfoArgs): Promise<void>;
