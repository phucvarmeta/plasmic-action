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

// src/api.ts
import fetch from "@plasmicapp/isomorphic-unfetch";
var PLASMIC_HOST = "https://data.plasmic.app";
function getPlasmicAppUserFromToken(opts) {
  return __async(this, null, function* () {
    const { host, token } = opts;
    const url = `${host || PLASMIC_HOST}/api/v1/app-auth/userinfo`;
    const result = yield fetch(url, {
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
    const result = yield fetch(url);
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
    const result = yield fetch(url, {
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
export {
  createPlasmicAppUser,
  ensurePlasmicAppUser,
  getPlasmicAppUser,
  getPlasmicAppUserFromToken
};
//# sourceMappingURL=index.esm.js.map
