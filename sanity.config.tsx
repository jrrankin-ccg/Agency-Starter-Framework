import { getPathForId } from "./helpers/sitemap/getPathForId";
import { baseLanguage, languages, LanguageType } from "./languages";
import { getSitemapQuery, SitemapItemType } from "./queries/sitemap.query";
import { schemaTypes } from "./studio/schemas";
import { structure, defaultDocumentNode } from "./studio/structure";
import { TRANSLATABLE_SCHEMAS } from "./types.sanity";
import { languageFilter } from "@sanity/language-filter";
import { visionTool } from "@sanity/vision";
import { ConfigContext, defineConfig, TemplateResponse } from "sanity";
import { media } from "sanity-plugin-media";
import { muxInput } from "sanity-plugin-mux-input";
import { deskTool } from "sanity/desk";

const env = (import.meta as any).env;

export default defineConfig({
  projectId: env.SANITY_STUDIO_API_PROJECT_ID,
  dataset: env.SANITY_STUDIO_API_DATASET,
  title: "Sanity Studio",
  basePath: "/cms",
  plugins: [
    deskTool({
      structure,
      defaultDocumentNode,
    }),
    languageFilter({
      supportedLanguages: languages,
      documentTypes: Object.keys(TRANSLATABLE_SCHEMAS),
      filterField: (enclosingType, field, selectedLanguageIds) => {
        return !(
          languages.map(({ id }) => id).includes(field.name as LanguageType) &&
          !selectedLanguageIds.includes(field.name)
        );
      },
    }),
    media(),
    visionTool({
      defaultApiVersion: "vX",
    }),
    muxInput(),
  ],

  document: {
    productionUrl: async (prev: any, context: any) => {
      const { client, document } = context;

      const sitemap: SitemapItemType[] = await client.fetch(getSitemapQuery());
      const path = getPathForId(document._id, sitemap, baseLanguage);

      if (path === "/" && document._id.indexOf("page_homepage") === -1) {
        return prev;
      }

      if (path) {
        return `${(import.meta as any).env.SANITY_STUDIO_PROJECT_PATH.replace(
          /\/+$/,
          "",
        )}${path}`;
      }

      return prev;
    },
    newDocumentOptions: (prev: TemplateResponse[], context: ConfigContext) => {
      prev = prev.filter((option: any) => {
        if (option.templateId.startsWith("config.")) return false;
        if (option.templateId.startsWith("media.")) return false;
        if (option.templateId.startsWith("card.")) return false;
        if (option.templateId.startsWith("password.")) return false;
        if (option.templateId === "footer") return false;
        if (option.templateId === "navigation") return false;
        if (option.templateId === "page.notfound") return false;
        if (option.templateId === "page.sitemap") return false;

        const schema = context?.schema?._original?.types.find(
          ({ name }: { name: string }) => name === option.templateId,
        );
        if ((schema?.options as any)?.singleton) return false;
        return true;
      });

      return prev;
    },
  },

  schema: {
    types: schemaTypes,
  },
});
