"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  createPlasmicAppUser: () => createPlasmicAppUser,
  ensurePlasmicAppUser: () => ensurePlasmicAppUser,
  getPlasmicAppUser: () => getPlasmicAppUser,
  getPlasmicAppUserFromToken: () => getPlasmicAppUserFromToken
});
module.exports = __toCommonJS(src_exports);

// src/api.ts
var import_isomorphic_unfetch = __toESM(require("@plasmicapp/isomorphic-unfetch"));
var PLASMIC_HOST = "https://data.plasmic.app";
function getPlasmicAppUserFromToken(opts) {
  return __async(this, null, function* () {
    const { host, token } = opts;
    const url = `${host || PLASMIC_HOST}/api/v1/app-auth/userinfo`;
    const result = yield (0, import_isomorphic_unfetch.default)(url, {
      headers: {
        "x-plasmic-data-user-auth-token": token
      }
    });
    const user = yield result.json();
    if (result.status >= 400) {
      return {
        user: null,
        token: null,
        error: new Error("Invalid token")
      };
    }
    return {
      user,
      token
    };
  });
}
function getPlasmicAppUser(opts) {
  return __async(this, null, function* () {
    const { host, appId, codeVerifier, code } = opts;
    const requestParams = new URLSearchParams();
    requestParams.set("grant_type", "authorization_code");
    requestParams.set("code", code);
    requestParams.set("code_verifier", codeVerifier);
    requestParams.set("client_id", appId);
    const url = `${host || PLASMIC_HOST}/api/v1/app-auth/token?${requestParams.toString()}`;
    const result = yield (0, import_isomorphic_unfetch.default)(url);
    const { token, user, error } = yield result.json();
    if (result.status >= 400 || error) {
      return {
        user: null,
        token: null,
        error: error != null ? error : new Error("Internal error")
      };
    }
    return {
      user,
      token
    };
  });
}
function ensurePlasmicAppUser(opts) {
  return __async(this, null, function* () {
    const { host, appSecret, roleId } = opts;
    const email = "email" in opts ? opts.email : void 0;
    const externalId = "externalId" in opts ? opts.externalId : void 0;
    const url = `${host || PLASMIC_HOST}/api/v1/app-auth/user`;
    const result = yield (0, import_isomorphic_unfetch.default)(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-plasmic-app-auth-api-token": appSecret
      },
      body: JSON.stringify({
        email,
        externalId,
        roleId
      })
    });
    const { user, token, error } = yield result.json();
    if (result.status >= 400 || error) {
      return {
        user: null,
        token: null,
        error: error != null ? error : new Error("Internal error")
      };
    }
    return {
      user,
      token
    };
  });
}
var createPlasmicAppUser = ensurePlasmicAppUser;
//# sourceMappingURL=index.js.map
