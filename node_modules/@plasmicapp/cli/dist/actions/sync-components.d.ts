import { ChecksumBundle, ComponentBundle } from "../api";
import { ComponentUpdateSummary } from "../utils/code-utils";
import { PlasmicContext, ProjectConfig, ProjectLock } from "../utils/config-utils";
export declare function syncProjectComponents(context: PlasmicContext, project: ProjectConfig, version: string, componentBundles: ComponentBundle[], forceOverwrite: boolean, summary: Map<string, ComponentUpdateSummary>, projectLock: ProjectLock, checksums: ChecksumBundle, baseDir: string): Promise<void>;
