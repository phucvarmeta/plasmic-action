import { ChecksumBundle, GlobalVariantBundle, ProjectMetaBundle } from "../api";
import { PlasmicContext } from "../utils/config-utils";
export declare function syncGlobalVariants(context: PlasmicContext, projectMeta: ProjectMetaBundle, bundles: GlobalVariantBundle[], checksums: ChecksumBundle, branchName: string, baseDir: string): Promise<void>;
