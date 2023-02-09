import { SchemaName } from "../../../types.sanity";
import {
  PARENT_FIELD,
  ORDER_PUBLISHED_DESC,
  pageBase,
  PUBLISHED_AT_FIELD,
  DEFAULT_CONTENT_PAGE_PREVIEW,
} from "./_page";
import { Pages } from "@vectopus/atlas-icons-react";
import React from "react";
import { defineType } from "sanity";

export const SCHEMA_NAME: SchemaName = "MyPageSchema";

export default defineType({
  name: SCHEMA_NAME,
  title: "MyPage",
  type: "document",
  orderings: [ORDER_PUBLISHED_DESC],
  /*OPTIONS*/
  preview: DEFAULT_CONTENT_PAGE_PREVIEW,
  icon: () => <Pages weight="thin" size={20} />,
  initialValue: {
    /*PARENT_INITIAL_VALUE*/
  },
  fieldsets: [...pageBase.fieldsets],
  fields: [
    /*PARENT_FIELD*/
    ...pageBase.fields,
    PUBLISHED_AT_FIELD,
  ],
});
