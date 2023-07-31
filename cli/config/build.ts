import { baseLanguage, LanguagesListType } from "../../languages";
import { write } from "../utils/is-write";
import {
  formatColors,
  formatFontFamily,
  formatFontSize,
  formatFontWeight,
  formatSafelist,
} from "./format-theme";

const DO_NOT_EDIT_FLAG = `// NOTE: This file is auto generated and should not be edited!`;

const PicoSanity = require("picosanity");
const fs = require("fs").promises;

const client = new PicoSanity({
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "development",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  apiVersion: "2021-03-25",
  useCdn: process.env.NODE_ENV === "production",
});

export type GroqThemeType = {
  colors: { name: string; value: string }[];
  fontFamily: { name: string; value: string }[];
  fontSize: {
    name: string;
    size: string;
    lineHeight?: string;
    letterSpacing?: string;
    fontWeight?: string;
  }[];
  fontWeight: { name: string; value: string }[];
  stylesheets: string[];
  icons: { predefined: {}; rest: [] };
};

export type ConfigType = {
  languages: LanguagesListType;
  domain: string;
  theme: {
    colors: Record<string, string>;
    fontFamily: Record<string, string[]>;
    fontSize: Record<
      string,
      | [
          string,
          {
            lineHeight?: string;
            letterSpacing?: string;
            fontWeight?: string;
          },
        ]
      | string
    >;
    fontWeight: Record<string, number>;
  };
  stylesheets: string;
  safelist: string[];
  icons: string[];
};

/**
 * Get published theme from Sanity config.theme
 */

export async function getConfig(): Promise<ConfigType> {
  // get languages
  const languages: LanguagesListType = await client.fetch(`
  *[_id == "config_general"][0] {
    languages[] { id, title }
  }.languages`);

  // get robotx.txt
  const domain: string = await client.fetch(`
  *[_id == "config_general"][0] { 
    "domain": domain.${baseLanguage}
  }.domain`);

  // get theme
  const theme: GroqThemeType = await client.fetch(`
  *[_id == "config_theme"][0] {
    colors[] { name, value },
    fontFamily[] { name, value },
    fontSize[] { name, size, lineHeight, letterSpacing, fontWeight },
    fontWeight[] { name, value },
    "stylesheets": stylesheets[] { value }.value,
  }`);

  if (!theme) {
    return {
      languages,
      domain,
      theme: {
        colors: {
          black: "#000000",
          white: "#ffffff",
        },
        fontFamily: {},
        fontWeight: {},
        fontSize: {},
      },
      safelist: [],
      stylesheets: "",
      icons: [],
    };
  }

  const colors = formatColors(theme.colors || {});
  const fontFamily = formatFontFamily(theme.fontFamily || {});
  const fontWeight = formatFontWeight(theme.fontWeight || {});
  const fontSize = formatFontSize(theme.fontSize || []);
  const safelist =
    formatSafelist({ colors, fontFamily, fontSize, fontWeight }) || [];
  const stylesheets = `/* This file is automatically generated. */

  ${theme.stylesheets ? theme.stylesheets?.join("\n\n") : ""}
  `;

  // get icon names
  let icons = await client.fetch(`
  *[_id == 'config_icons'][0] {
    predefined,
    "rest": rest[].slug.current
  }`);
  icons = [...Object.keys(icons?.predefined || {}), ...(icons?.rest || [])];

  return {
    languages,
    domain,
    theme: {
      colors,
      fontFamily,
      fontWeight,
      fontSize,
    },
    safelist,
    stylesheets,
    icons,
  };
}

export default async function buildConfig() {
  const config = await getConfig();

  await fs.writeFile(
    `${__dirname}/../../engine.config.js`,
    `${DO_NOT_EDIT_FLAG}
    
export default ${JSON.stringify(config, null, 2)}`,
  );

  // write stylesheets to file
  await fs.writeFile(
    `${__dirname}/../../public/engine.styles.css`,
    config?.stylesheets,
  );

  // write locales to file for use in next.config.js
  await fs.writeFile(
    `${__dirname}/../../locales.js`,
    `${DO_NOT_EDIT_FLAG}
    
module.exports = ${JSON.stringify(
      config?.languages ? config.languages.map(({ id }) => id) : ["en"],
    )}`,
  );

  // replace domain in robots.txt
  const robotsTxt = await fs.readFile(`${__dirname}/../../public/robots.txt`);
  const robotsTxtLines = robotsTxt
    .toString()
    .split("\n")
    .map((line: string) => {
      if (line.startsWith("Host:")) {
        return `Host: https://${config?.domain || ""}`;
      }

      if (line.startsWith("Sitemap:")) {
        return `Sitemap: https://${config?.domain || ""}/sitemap.xml`;
      }

      return line;
    });

  await fs.writeFile(
    `${__dirname}/../../public/robots.txt`,
    robotsTxtLines.join("\n"),
  );
}

if (write) buildConfig();

// https://google.com
