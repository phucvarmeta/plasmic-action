import { ChecksumBundle, ProjectMetaBundle } from "../api";
import { PlasmicContext, ProjectConfig, ProjectLock } from "../utils/config-utils";
export declare const DEFAULT_SPLITS_PROVIDER_NAME = "PlasmicSplitsProvider";
export declare function syncSplitsProvider(context: PlasmicContext, projectMeta: ProjectMetaBundle, projectConfig: ProjectConfig, projectLock: ProjectLock, checksums: ChecksumBundle, baseDir: string): Promise<void>;
export declare function getSplitsProviderResourcePath(context: PlasmicContext, projectConfig: ProjectConfig): string;
