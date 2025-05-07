import { PlasmicConfig } from "./config-utils";
export declare function getParsedCliPackageJson(): any;
export declare function getCliVersion(): string;
/**
 * Call this to check if we match the engine policy
 */
export declare function checkEngineStrict(): boolean;
export declare function getParsedPackageJson(): any;
export declare function findInstalledVersion(config: PlasmicConfig, baseDir: string, pkg: string): string | undefined;
/**
 * Detects if the cli is globally installed.  `rootDir` is the folder
 * where plasmic.json is
 */
export declare function isCliGloballyInstalled(rootDir: string): boolean;
export declare function findPackageJsonDir(rootDir: string): string | undefined;
export declare function installUpgrade(config: PlasmicConfig, pkg: string, baseDir: string, opts?: {
    global?: boolean;
    dev?: boolean;
}): boolean;
export declare function installCommand(config: PlasmicConfig, pkg: string, baseDir: string, opts?: {
    global?: boolean;
    dev?: boolean;
}): string;
export declare function detectPackageManager(config: PlasmicConfig, baseDir: string): "npm" | "yarn" | "yarn2" | "pnpm" | "unknown";
