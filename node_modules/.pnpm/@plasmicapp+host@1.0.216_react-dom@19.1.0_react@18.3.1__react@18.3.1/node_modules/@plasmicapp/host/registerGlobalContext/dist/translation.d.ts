import React from "react";
export type PlasmicTranslator = (str: string, opts?: {
    components?: {
        [key: string]: React.ReactElement;
    };
}) => React.ReactNode;
export interface PlasmicI18NContextValue {
    translator?: PlasmicTranslator;
    tagPrefix?: string;
}
export declare const PlasmicTranslatorContext: React.Context<PlasmicI18NContextValue | PlasmicTranslator | undefined>;
export declare function usePlasmicTranslator(): PlasmicTranslator | undefined;
