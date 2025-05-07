export declare const createPlasmicAppUser: typeof ensurePlasmicAppUser;

export declare function ensurePlasmicAppUser(opts: {
    host?: string;
    appSecret: string;
    roleId?: string;
} & UserIdentifier): Promise<PlasmicUserResult>;

export declare function getPlasmicAppUser(opts: {
    host?: string;
    appId: string;
    codeVerifier: string;
    code: string;
}): Promise<PlasmicUserResult>;

export declare function getPlasmicAppUserFromToken(opts: {
    host?: string;
    token: string;
}): Promise<PlasmicUserResult>;

export declare interface PlasmicUser {
    email: string;
    properties: Record<string, unknown> | null;
    roleId: string;
    roleName: string;
    roleIds: string[];
    roleNames: string[];
}

export declare type PlasmicUserResult = {
    user: null;
    token: null;
    error: Error;
} | {
    user: PlasmicUser;
    token: string;
    error?: never;
};

declare type UserIdentifier = {
    email: string;
} | {
    externalId: string;
};

export { }
