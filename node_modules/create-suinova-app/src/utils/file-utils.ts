import type {
  ComponentConfig,
  PlasmicConfig,
} from "suinova-cli/dist/utils/config-utils";
import { existsSync, promises as fs, unlinkSync } from "fs";
import glob from "glob";
import L from "lodash";
import * as path from "upath";
import { README } from "../templates/readme";
import { WELCOME_PAGE } from "../templates/welcomePage";
import { ensure } from "./lang-utils";
import { installUpgrade } from "./npm-utils";
import { JsOrTs, PlatformType } from "./types";

/**
 * Runs the search pattern through `glob` and deletes all resulting files
 * @param searchPattern - glob search query
 * @param skipPatterns - array of fragments. Skip any file contains any of the fragments
 */
export function deleteGlob(
  searchPattern: string,
  skipPatterns?: string[]
): void {
  const filesToDelete = glob
    .sync(searchPattern)
    .filter(
      (file) =>
        !skipPatterns || !skipPatterns.find((pattern) => file.includes(pattern))
    );
  filesToDelete.forEach((f: string) => unlinkSync(f));
}

export function stripExtension(
  filename: string,
  removeComposedPath = false
): string {
  const ext = removeComposedPath
    ? filename.substring(filename.indexOf("."))
    : path.extname(filename);
  if (!ext || filename === ext) {
    return filename;
  }
  return filename.substring(0, filename.lastIndexOf(ext));
}

export async function writePlasmicLoaderJson(
  projectDir: string,
  projectId: string,
  projectApiToken: string
): Promise<void> {
  const plasmicLoaderJson = path.join(projectDir, "plasmic-loader.json");
  const content = {
    projects: [
      {
        projectId,
        projectApiToken,
      },
    ],
  };
  await fs.writeFile(plasmicLoaderJson, JSON.stringify(content));
}

/**
 * Overwrite the README file
 * @param projectPath
 * @param platform
 * @param buildCommand
 */
export async function overwriteReadme(
  projectPath: string,
  platform: PlatformType,
  buildCommand: string
): Promise<void> {
  const readmeFile = path.join(projectPath, "README.md");
  const contents = README(platform, buildCommand);
  await fs.writeFile(readmeFile, contents);
}

// Function to extract the component name from renderModuleFilePath
export function extractComponentName(renderModuleFilePath: string) {
  const parts = renderModuleFilePath.split("/");
  const filename = parts[parts.length - 1];
  // Remove the extension and "Plasmic" prefix
  return filename.replace(/\.tsx$/, "").replace(/^Plasmic/, "");
}

// Step 1: Extract routes from plasmic.json
export async function extractRoutes(projectPath: string) {
  const routes: {
    componentName: string;
    modulePath: string;
    path: string;
    importPath: string;
  }[] = [];

  const plasmicJsonPath = path.join(projectPath, "plasmic.json");
  // Read the plasmic.json file
  const plasmicJson = JSON.parse(await fs.readFile(plasmicJsonPath, "utf8"));

  // Process all projects in the plasmic.json file
  plasmicJson.projects.forEach((project: any) => {
    if (project.components) {
      project.components.forEach((component: any) => {
        // Check if the component is a page with a path
        if (component.componentType === "page" && component.path) {
          routes.push({
            path: component.path,
            componentName: component.name,
            importPath: extractComponentName(component.renderModuleFilePath),
            modulePath:
              component.importSpec?.modulePath || `${component.name}.tsx`,
          });
        }
      });
    }
  });

  return routes;
}

// Step 2: Generate routing code
export async function generateRoutingCode(projectPath: string) {
  const routes = await extractRoutes(projectPath);

  // Generate import statements
  const imports = routes
    .map(
      (route) =>
        `import ${route.componentName} from "./components/${route.modulePath}";`
    )
    .join("\n");

  // Generate route elements
  const routeElements = routes
    .map(
      (route) =>
        `        <Route path="${route.path}" element={<${route.componentName} />} />`
    )
    .join("\n");

  // Generate the complete App.tsx code
  const appCode = `import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
${imports}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="${routes[0].path}" />}
        />
${routeElements}
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;
`;

  const appPath = path.join(projectPath, "src", "App.tsx");
  await fs.writeFile(appPath, appCode);
}

export async function updateViteFile(projectPath: string) {
  const tsConfigAppFile = path.join(projectPath, "tsconfig.app.json");
  const tsConfigNodeFile = path.join(projectPath, "tsconfig.node.json");
  const searchText = '"verbatimModuleSyntax": true';
  const replaceText = '"verbatimModuleSyntax": false';

  const configAppFileContent = await fs.readFile(tsConfigAppFile, "utf8");
  console.log(
    "🚀 ~ updateViteFile ~ configAppFileContent:",
    configAppFileContent
  );
  const replacedAppFileContent = configAppFileContent.replace(
    searchText,
    replaceText
  );
  console.log(
    "🚀 ~ updateViteFile ~ replacedAppFileContent:",
    replacedAppFileContent
  );
  await fs.writeFile(tsConfigAppFile, replacedAppFileContent);

  const configNodeFileContent = await fs.readFile(tsConfigNodeFile, "utf8");
  console.log(
    "🚀 ~ updateViteFile ~ configNodeFileContent:",
    configNodeFileContent
  );
  const replacedNodeFileContent = configNodeFileContent.replace(
    searchText,
    replaceText
  );
  console.log(
    "🚀 ~ updateViteFile ~ replacedNodeFileContent:",
    replacedNodeFileContent
  );
  await fs.writeFile(tsConfigNodeFile, configNodeFileContent);
}

/**
 * Generate a file to render the component
 * @param componentAbsPath - absolute path to component to render
 * @param indexAbsPath - absolute path of index file to write
 * @returns
 */
export async function generateHomePage(
  // componentAbsPath: string,
  indexAbsPath: string,
  projectPath: string,
  globalContextsAbsPath?: string
): Promise<string> {
  // console.log("🚀 ~ componentAbsPath:", componentAbsPath);
  console.log("🚀 ~ projectPath:", projectPath);
  // const componentFilename = path.basename(componentAbsPath);
  // const componentName = stripExtension(componentFilename);
  // The relative import path from App.js to the Plasmic component
  // const componentRelativePath = path.relative(
  //   path.dirname(indexAbsPath),
  //   componentAbsPath
  // );

  const routes = await extractRoutes(projectPath);

  const globalContextsImport = globalContextsAbsPath
    ? `import GlobalContextsProvider from './${stripExtension(
        path.relative(path.dirname(indexAbsPath), globalContextsAbsPath)
      )}'`
    : ``;
  const maybeWrapInGlobalContexts = (content: string) => {
    return globalContextsAbsPath
      ? `<GlobalContextsProvider>${content}</GlobalContextsProvider>`
      : content;
  };
  const routeElements = routes
    .map(
      (route) =>
        `        <Route path="${route.path}" element={<${route.componentName} />} />`
    )
    .join("\n");

  // Generate import statements
  const imports = routes
    .map(
      (route) =>
        `import ${route.componentName} from "./components/${route.modulePath}";`
    )
    .join("\n");

  const appjsContents = `
  import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
  ${globalContextsImport}
  ${imports}

function App() {
  return (${maybeWrapInGlobalContexts(`
     <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="${routes[0].path}" />}
        />
${routeElements}
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  `)});
}

export default App;
  `;
  return appjsContents;
}

/**
 * Generate a Welcome page based on a PlasmicConfig
 * @param config - PlasmicConfig
 * @param noPages - don't render links to pages
 * @returns
 */
export function generateWelcomePage(
  config: PlasmicConfig,
  platform: string
): string {
  let pages:
    | {
        components: ComponentConfig[];
        dir: string;
        getPageSection: () => string;
      }
    | undefined;
  if (platform !== "react" && config && L.isArray(config.projects)) {
    const components = L.flatMap(config.projects, (p) => p.components).filter(
      (c) => c.componentType === "page"
    );
    const dir =
      config?.nextjsConfig?.pagesDir ?? config?.gatsbyConfig?.pagesDir;
    if (components.length > 0 && dir) {
      pages = {
        components,
        dir,
        getPageSection: () => {
          const pageLinks = components
            .map((pc) => {
              // Get the relative path on the filesystem
              const relativePath = path.relative(dir, pc.importSpec.modulePath);
              // Format as an absolute path without the extension name
              const relativeLink = "/" + stripExtension(relativePath);
              if (platform === "nextjs") {
                return `<li><Link href="${relativeLink}">${pc.name} - ${relativeLink}</Link></li>`;
              } else {
                return `<li><a style={{ color: "blue" }} href="${relativeLink}">${pc.name} - ${relativeLink}</a></li>`;
              }
            })
            .join("\n");
          return `
          <h3>Your pages:</h3>
          <ul>
            ${pageLinks}
          </ul>
    `;
        },
      };
    }
  }

  const content = WELCOME_PAGE(
    !!pages,
    platform,
    pages?.getPageSection() ?? ""
  );
  return content;
}

export async function getPlasmicConfig(
  projectPath: string,
  platform: PlatformType,
  scheme: string
): Promise<PlasmicConfig> {
  const isNextjs = platform === "nextjs";
  const isGatsby = platform === "gatsby";
  const isLoader = scheme === "loader";
  const isCodegen = scheme === "codegen";
  const configPath = ensure(
    isCodegen
      ? "plasmic.json"
      : isNextjs && isLoader
      ? ".plasmic/plasmic.json"
      : isGatsby && isLoader
      ? ".cache/.plasmic/plasmic.json"
      : undefined
  );
  const configStr = await fs.readFile(path.join(projectPath, configPath));
  return JSON.parse(configStr.toString());
}

// Create tsconfig.json if it doesn't exist
// this will force Plasmic to recognize Typescript
export async function ensureTsconfig(projectPath: string): Promise<void> {
  const tsconfigPath = path.join(projectPath, "tsconfig.json");
  if (!existsSync(tsconfigPath)) {
    await fs.writeFile(tsconfigPath, "");
    const installTsResult = await installUpgrade("typescript @types/react", {
      workingDir: projectPath,
    });
    if (!installTsResult) {
      throw new Error("Failed to install Typescript");
    }
  }
}

export function ifTs(ts: JsOrTs, str: string) {
  return ts === "ts" ? str : "";
}
