export interface ProjectTokenArgs {
    projectId: string;
    host: string;
}
export declare const getProjectApiToken: (projectId: string, host?: string) => Promise<string | undefined>;
export declare const projectToken: (args: ProjectTokenArgs) => Promise<void>;
