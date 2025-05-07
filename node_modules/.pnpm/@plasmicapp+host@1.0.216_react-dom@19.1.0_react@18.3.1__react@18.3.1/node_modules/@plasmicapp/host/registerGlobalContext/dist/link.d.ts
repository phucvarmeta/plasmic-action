import React from "react";
export declare function usePlasmicLinkMaybe(): React.ComponentType<React.ComponentProps<"a">> | undefined;
export declare function usePlasmicLink(): React.ComponentType<React.ComponentProps<"a">>;
export declare function PlasmicLinkProvider(props: {
    Link: React.ComponentType<any> | undefined;
    children?: React.ReactNode;
}): React.JSX.Element;
