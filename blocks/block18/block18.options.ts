import { pick } from "../../helpers/utils/object";
import { SIZES } from "../../types";

export const COLUMN_OPTIONS = {
  1: "One column",
  2: "Two columns",
  3: "Three columns",
  4: "Four columns",
};
export type ColumnType = keyof typeof COLUMN_OPTIONS;

export const GAP_OPTIONS = pick(SIZES, "none", "xs", "sm", "md", "lg", "xl");
export type GapType = keyof typeof GAP_OPTIONS;

export const BUTTON_POSITION_OPTIONS = {
  before: "Before grid",
  after: "After grid",
};
export type ButtonPositionType = keyof typeof BUTTON_POSITION_OPTIONS;
