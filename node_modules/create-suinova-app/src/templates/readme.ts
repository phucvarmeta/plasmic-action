import { PlatformType, platformTypeToString } from "../utils/types";

export function README(platform: PlatformType, buildCommand: string): string {
  return `This is a ${platformTypeToString(
    platform
  )} project bootstrapped with [\`create-suinova-app\`](https://www.npmjs.com/package/create-suinova-app).

## Getting Started

First, run the development server:

\`\`\`bash
${buildCommand}
\`\`\`

Open your browser to see the result.

You can start editing your project in Plasmic Studio. The page auto-updates as you edit the project.

## Learn More

With SuiNova, you can enable non-developers on your team to publish pages and content into your website or app.

You can check out [the SuiNova GitHub repository](https://github.com/plasmicapp/plasmic) - your feedback and contributions are welcome!
`;
}
