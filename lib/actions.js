"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlasmicAction = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const exec_1 = require("./exec");
const util_1 = require("./util");
const create_plasmic_app_1 = require("create-plasmic-app");
const gitUserName = "Plasmic Bot";
const gitUserEmail = "ops+git@plasmic.app";
class PlasmicAction {
    constructor(args) {
        this.args = args;
        this.opts = {
            cwd: path_1.default.join(".", args.directory || "."),
            shell: "bash",
        };
        this.remote = args.githubToken
            ? `https://x-access-token:${args.githubToken}@github.com/${process.env["GITHUB_REPOSITORY"]}.git`
            : undefined;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.args.run) {
                case "init":
                    const synced = yield this.init();
                    return { synced };
                case "sync":
                    const new_branch = yield this.sync();
                    return { new_branch };
                case "build":
                    const publish_dir = yield this.build();
                    return { publish_dir };
                default:
                    throw new Error(`Unknown run action: ${this.args.run}`);
            }
        });
    }
    /**
     * Detects if there is a project in the working directory (by testing
     * package.json existence). If there isn't, use create-plasmic-app to
     * create a new one.
     *
     * @returns {synced} boolean indicating whether projectId was synced or not.
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const isNewApp = !(0, fs_1.existsSync)(path_1.default.join(this.opts.cwd, "package.json"));
            if (!isNewApp) {
                console.log("Detected existing app. Moving forward...");
                yield this.updateDependencies();
                return false;
            }
            (0, util_1.assertNoSingleQuotes)(this.args.branch);
            (0, util_1.assertNoSingleQuotes)(this.args.platform);
            (0, util_1.assertNoSingleQuotes)(this.args.scheme);
            (0, util_1.assertNoSingleQuotes)(this.args.projectId);
            (0, util_1.assertNoSingleQuotes)(this.args.projectApiToken);
            if (this.args.platform === "" || this.args.scheme === "") {
                throw new Error("Platform and scheme must be specified.");
            }
            yield (0, exec_1.exec)(`git checkout '${this.args.branch}'`, this.opts);
            (0, create_plasmic_app_1.setMetadata)({
                source: "plasmic-action",
            });
            const relTmpDir = "tmp-cpa";
            process.env.PLASMIC_HOST = "https://suinova.var-meta.com";
            yield (0, create_plasmic_app_1.create)({
                resolvedProjectPath: path_1.default.resolve(this.opts.cwd, relTmpDir),
                projectId: this.args.projectId,
                projectApiToken: this.args.projectApiToken,
                platform: this.args.platform,
                scheme: this.args.scheme,
                jsOrTs: this.args.language || "ts",
                platformOptions: this.args.platform === "nextjs" ? { nextjs: { appDir: false } } : {},
            });
            yield (0, exec_1.exec)(`rm -rf '${relTmpDir}/.git'`, this.opts);
            // Gatsby build breaks if we move the project directory without deleting
            // the cache. If that's fixed by Gatsby we can stop removing the cache
            // in the next line.
            yield (0, exec_1.exec)(`rm -rf '${relTmpDir}/.cache'`, this.opts);
            yield (0, exec_1.exec)(`shopt -s dotglob && mv * ../`, Object.assign(Object.assign({}, this.opts), { cwd: path_1.default.join(this.opts.cwd, relTmpDir) }));
            yield (0, exec_1.exec)(`rm -rf '${relTmpDir}'`, this.opts);
            return yield this.commit(this.args.branch);
        });
    }
    updateDependencies() {
        return __awaiter(this, void 0, void 0, function* () {
            const pm = (0, util_1.mkPackageManagerCmds)(this.opts.cwd);
            if (this.args.scheme === "loader") {
                console.log("Updating dependencies.");
                const platform = this.detectPlatform();
                if (platform) {
                    yield (0, exec_1.exec)(`${pm.add} @plasmicapp/loader-${platform}`, this.opts);
                }
            }
        });
    }
    /**
     * Syncs a project in the working directory if scheme == "codegen".
     *
     * @returns {newBranch} name of created branch (if PR was requested) or
     * undefined if no new branch was created.
     */
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.args.scheme === "loader") {
                console.log("Nothing to sync; scheme is set to 'loader'.");
                return undefined;
            }
            const pm = (0, util_1.mkPackageManagerCmds)(this.opts.cwd);
            const newBranch = this.args.syncAction === "pr"
                ? (0, util_1.mkPrBranchName)(this.args.branch)
                : undefined;
            (0, util_1.assertNoSingleQuotes)(this.args.branch);
            if (newBranch) {
                (0, util_1.assertNoSingleQuotes)(newBranch);
            }
            (0, util_1.assertNoSingleQuotes)(this.args.projectId);
            (0, util_1.assertNoSingleQuotes)(this.args.projectApiToken);
            yield (0, exec_1.exec)(`git checkout '${this.args.branch}'`, this.opts);
            if (newBranch) {
                yield (0, exec_1.exec)(`git checkout -B '${newBranch}'`, this.opts);
            }
            yield exec_1.exec(`${pm.add} @suinovaapp/cli`, this.opts);
            yield exec_1.exec(`${pm.cmd} plasmic sync --projects '${this.args.projectId}:${this.args.projectApiToken}' --yes`, this.opts);
            return (yield this.commit(newBranch || this.args.branch))
                ? newBranch
                : undefined;
        });
    }
    /**
     * Checkouts given branch and builds project using Next.js, Gatsby or CRA
     * command depending on platform argument.
     *
     * @returns {publishDir} generated directory to publish.
     */
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, util_1.assertNoSingleQuotes)(this.args.branch);
            yield (0, exec_1.exec)(`git checkout '${this.args.branch}'`, this.opts);
            if (this.args.skipIfPlasmic) {
                const { stdout: authorEmail } = yield (0, exec_1.exec)(`git log -1 --pretty=format:'%ae'`, this.opts);
                if (authorEmail.trim() === gitUserEmail) {
                    console.log("Skipping; last commit was made by Plasmic.");
                    return "";
                }
            }
            const pm = (0, util_1.mkPackageManagerCmds)(this.opts.cwd);
            yield (0, exec_1.exec)(`${pm.install}`, this.opts);
            const platform = this.args.platform || this.detectPlatform();
            let dir;
            switch (platform) {
                case "nextjs":
                    yield (0, exec_1.exec)(`${pm.cmd} next build`, this.opts);
                    yield (0, exec_1.exec)(`${pm.cmd} next export`, this.opts);
                    dir = "out";
                    break;
                case "gatsby":
                    yield (0, exec_1.exec)(`${pm.cmd} gatsby build`, this.opts);
                    dir = "public";
                    break;
                case "react":
                    yield (0, exec_1.exec)(`${pm.run} build`, this.opts);
                    dir = "build/static";
                    break;
                default:
                    throw new Error(`Unknown platform '${platform}'`);
            }
            // A .nojekyll file is required to bypass Jekyll processing and publish
            // files and directories that start with underscores, e.g. _next.
            // https://github.blog/2009-12-29-bypassing-jekyll-on-github-pages/
            const nojekyllPath = path_1.default.join(dir, ".nojekyll");
            yield (0, exec_1.exec)(`touch ${nojekyllPath}`, this.opts);
            return dir;
        });
    }
    detectPlatform() {
        const packageJson = (0, fs_1.readFileSync)(path_1.default.join(this.opts.cwd, "package.json"), "utf8");
        const parsedPackageJson = JSON.parse(packageJson);
        if ((0, fs_1.existsSync)(path_1.default.join(this.opts.cwd, "gatsby-config.js"))) {
            return "gatsby";
        }
        if (parsedPackageJson.scripts.build === "next build" ||
            "next" in parsedPackageJson.dependencies) {
            return "nextjs";
        }
        return "react";
    }
    /**
     * Commits existing working directory and push to remote (setting branch
     * upstream).
     */
    commit(branch) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.remote) {
                throw new Error("No git remote to push");
            }
            if (!this.args.title) {
                throw new Error("No commit title to use");
            }
            (0, util_1.assertNoSingleQuotes)(this.remote);
            const commitMessage = `${this.args.title}\n\n${this.args.description}`;
            yield (0, exec_1.exec)(`git add -A .`, this.opts);
            yield (0, exec_1.exec)(`git config user.name '${gitUserName}'`, this.opts);
            yield (0, exec_1.exec)(`git config user.email '${gitUserEmail}'`, this.opts);
            const { stdout: staged } = yield (0, exec_1.exec)(`git status --untracked-files=no --porcelain`, this.opts);
            if (!staged.trim()) {
                console.log("Skipping commit; no changes.");
                return false;
            }
            yield (0, exec_1.exec)(`git commit -F -`, Object.assign(Object.assign({}, this.opts), { input: commitMessage }));
            yield (0, exec_1.exec)(`git push -u '${this.remote}' '${branch}'`, this.opts);
            return true;
        });
    }
}
exports.PlasmicAction = PlasmicAction;
