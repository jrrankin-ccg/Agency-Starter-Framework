import { SchemaName } from "../../../types.sanity";
import {
  DEFAULT_CONTENT_PAGE_PREVIEW,
  ORDER_PUBLISHED_DESC,
  pageBase,
  PARENT_FIELD,
  PUBLISHED_AT_FIELD,
  TAGS_FIELD,
} from "./_page";
import { EarMuffs } from "@vectopus/atlas-icons-react";
import React from "react";
import { defineType } from "sanity";

export const SCHEMA_NAME: SchemaName = "page.podcast";

export default defineType({
  name: SCHEMA_NAME,
  title: "Podcast",
  type: "document",
  orderings: [ORDER_PUBLISHED_DESC],
  preview: DEFAULT_CONTENT_PAGE_PREVIEW,
  icon: () => <EarMuffs weight="thin" size={20} />,
  initialValue: {
    parent: { _type: "reference", _ref: "page_podcasts" },
  },
  fieldsets: [...pageBase.fieldsets],
  fields: [
    {
      ...PARENT_FIELD,
      to: [{ type: "page.podcasts" }],
      options: { disableNew: true },
      hidden: true,
    },
    ...pageBase.fields,
    TAGS_FIELD,
    PUBLISHED_AT_FIELD,
  ],
});
