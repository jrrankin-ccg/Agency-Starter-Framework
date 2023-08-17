import { getOriginalImageDimensions } from "../../helpers/sanity/image-url";
import { isEmptyObject, removeEmptyValues } from "../../helpers/utils/object";
import { BREAKPOINTS, useBreakpoint } from "../../hooks/useBreakpoint";
import { ImageType } from "../../types";
import {
  backgroundRoundedBottomClasses,
  backgroundRoundedTopClasses,
  BlockRoundedType,
} from "../block/background.options";
import { ResponsiveImageProps } from "../images/ResponsiveImage";
import { DecorationLocationType } from "./decoration.options";
import cx from "classnames";
import DOMPurify from "dompurify";
import { createCSSTransformBuilder } from "easy-css-transform-builder";
import { ComponentType, CSSProperties, lazy, useEffect, useState } from "react";

const ResponsiveImage = lazy<ComponentType<ResponsiveImageProps>>(
  () =>
    import(
      /* webpackChunkName: "ResponsiveImage" */ "../images/ResponsiveImage"
    ),
);

export type DecorationType = {
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  width?: number | string;
  height?: number | string;
  translateX?: number | string;
  translateY?: number | string;
  rotate?: number | string;
  scale?: number | string;
  background?: string;
  opacity?: number;
  hidden?: boolean;
  image?: ImageType;
  html?: string;
  repeat?: boolean;
};

export type DecorationWrapperType = {
  breakout?: boolean;
  location?: DecorationLocationType;
  mobile?: DecorationType;
  tablet?: DecorationType;
  desktop?: DecorationType;
};

export type DecorationProps = {
  _key?: string;
  title?: string;
  theme?: {
    rounded?: BlockRoundedType;
  };
  rounded?: boolean;
  preset?: DecorationWrapperType;
} & DecorationWrapperType;

const addUnit = (value: string, unit = "px") => {
  if (typeof value === "undefined") return undefined;
  if (typeof value === "string" && !value.trim()?.length) return undefined;
  if (typeof value === "number" && isNaN(value)) return undefined;
  if (value === "auto") return value;

  if (!isNaN(+value)) return `${value}${unit}`;
  return value;
};

const createStyleObject = (obj: Record<string, unknown>): CSSProperties => {
  if (!obj) return {};
  const newObj = {
    top: addUnit(obj.top as string),
    right: addUnit(obj.right as string),
    bottom: addUnit(obj.bottom as string),
    left: addUnit(obj.left as string),
    width: addUnit(obj.width as string),
    height: addUnit(obj.height as string),
    background: obj.background,
    opacity: obj.opacity,
    transform: obj.transform,
  } as CSSProperties;

  return newObj;
};

type TransformProps = {
  translateX?: DecorationType["translateX"];
  translateY?: DecorationType["translateY"];
  rotate?: DecorationType["rotate"];
  scale?: DecorationType["scale"];
};

const createTransformStyle = ({
  translateX,
  translateY,
  rotate,
  scale,
}: TransformProps) => {
  const transformStyleBuilder = createCSSTransformBuilder({
    angle: "deg",
    length: "px",
  });

  const transformObj: Record<string, string> = {};
  if (translateX) transformObj.translateX = addUnit(translateX as string) || "";
  if (translateY) transformObj.translateY = addUnit(translateY as string) || "";
  if (rotate) transformObj.rotate = addUnit(rotate as string, "deg") || "";
  if (scale) transformObj.scale = (scale as string) || "";

  if (!Object.keys(transformObj).length) return undefined;
  return transformStyleBuilder(transformObj);
};

export const Decoration = ({
  _key,
  title,
  breakout,
  theme,
  mobile = {},
  tablet,
  desktop,
  preset,
}: DecorationProps) => {
  const { screenWidth } = useBreakpoint();

  let styleObj: CSSProperties = {};
  let hidden = Boolean(mobile?.hidden) || Boolean(preset?.mobile?.hidden);
  let image = mobile?.image || preset?.mobile?.image;
  let html = mobile?.html || preset?.mobile?.html;
  let repeat = mobile?.repeat || preset?.mobile?.repeat;

  const [innerHTML, setInnerHTML] = useState<null | string>(null);

  useEffect(() => {
    if (html) setInnerHTML(DOMPurify?.sanitize?.(html));
  }, [html]);

  mobile = removeEmptyValues(mobile);
  if (tablet) tablet = removeEmptyValues(tablet);
  if (desktop) desktop = removeEmptyValues(desktop);

  if (preset?.mobile) {
    mobile = { ...removeEmptyValues(preset.mobile), ...(mobile || {}) };
  }
  if (preset?.tablet) {
    tablet = { ...removeEmptyValues(preset.tablet), ...(tablet || {}) };
  }
  if (preset?.desktop) {
    desktop = { ...removeEmptyValues(preset.desktop), ...(desktop || {}) };
  }

  styleObj = createStyleObject({
    ...mobile,
    transform: createTransformStyle({
      translateX: mobile?.translateX,
      translateY: mobile?.translateY,
      rotate: mobile?.rotate,
      scale: mobile?.scale,
    }),
  });

  // tablet view
  if (screenWidth > BREAKPOINTS.md && tablet && !isEmptyObject(tablet)) {
    styleObj = createStyleObject({
      ...styleObj,
      ...tablet,
      transform: createTransformStyle({
        translateX: tablet?.translateX || mobile?.translateX,
        translateY: tablet?.translateY || mobile?.translateY,
        rotate: tablet?.rotate || mobile?.rotate,
        scale: tablet?.scale || mobile?.scale,
      }),
    });
    image = tablet.image || preset?.tablet?.image || image;
    html = tablet.html || preset?.tablet?.html || html;
    repeat = tablet?.repeat || preset?.tablet?.repeat || repeat;

    if (tablet?.hidden === false || preset?.tablet?.hidden === false)
      hidden = false;
    if (tablet?.hidden === true || preset?.tablet?.hidden === true)
      hidden = true;
  }

  // desktop view
  if (screenWidth > BREAKPOINTS.lg && desktop && !isEmptyObject(desktop)) {
    styleObj = createStyleObject({
      ...styleObj,
      ...desktop,
      transform: createTransformStyle({
        translateX:
          desktop?.translateX || tablet?.translateX || mobile?.translateX,
        translateY:
          desktop?.translateY || tablet?.translateY || mobile?.translateY,
        rotate: desktop?.rotate || tablet?.rotate || mobile?.rotate,
        scale: desktop?.scale || tablet?.scale || mobile?.scale,
      }),
    });

    image = desktop.image || preset?.desktop?.image || image;
    html = desktop.html || preset?.desktop?.html || html;
    repeat = desktop?.repeat || preset?.desktop?.repeat || repeat;

    if (desktop?.hidden === false || preset?.desktop?.hidden === false)
      hidden = false;
    if (desktop?.hidden === true || preset?.desktop?.hidden === true)
      hidden = true;
  }

  if (image && repeat) {
    styleObj.background = `url(${image?.src})`;
  }

  if (image && !repeat) {
    styleObj.aspectRatio =
      getOriginalImageDimensions(image?.src).aspectRatio || "auto";
  }

  if (hidden) return null;

  return (
    <div
      className={cx("absolute inset-0 pointer-events-none", {
        ["overflow-hidden"]: breakout !== true,
        [backgroundRoundedTopClasses.md]: theme?.rounded?.top === "md",
        [backgroundRoundedBottomClasses.md]: theme?.rounded?.bottom === "md",
        [backgroundRoundedTopClasses.lg]: theme?.rounded?.top === "lg",
        [backgroundRoundedBottomClasses.lg]: theme?.rounded?.bottom === "lg",
      })}
    >
      <div
        key={_key}
        aria-hidden="true"
        className="absolute"
        data-key={_key}
        style={{
          ...styleObj,
        }}
      >
        {image && !repeat && <ResponsiveImage {...image} fill roundSize={25} />}
        {innerHTML && (
          <div
            dangerouslySetInnerHTML={
              html
                ? {
                    __html: innerHTML,
                  }
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

export default Decoration;
