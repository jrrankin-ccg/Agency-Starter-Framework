import { Button, ButtonProps } from "./Button";
import { AlignType, DIRECTION_OPTIONS } from "./buttongroup.options";
import cx from "classnames";
import React from "react";

export type DirectionType = keyof typeof DIRECTION_OPTIONS;

export type ButtonGroupProps = {
  items: ButtonProps[];
  direction?: DirectionType;
  stretch?: boolean;
  align?: AlignType;
  className?: string;
};

export const ButtonGroup = ({
  items,
  direction,
  stretch,
  align,
  className,
}: ButtonGroupProps) => {
  return (
    <div
      className={cx(
        "flex-wrap gap-3 md:gap-4",
        {
          ["flex-col"]: direction === "vertical",
          ["inline-flex"]: !stretch,
          ["flex w-full"]: stretch,
          ["justify-start"]: direction === "horizontal" && align === "left",
          ["justify-center"]: direction === "horizontal" && align === "center",
          ["justify-end"]: direction === "horizontal" && align === "right",
          ["items-start"]: direction === "vertical" && align === "left",
          ["items-center"]: direction === "vertical" && align === "center",
          ["items-end"]: direction === "vertical" && align === "right",
        },
        className,
      )}
    >
      {items?.map((item) => (
        <div
          key={item.label}
          className={cx("flex-shrink-0 max-w-full", {
            ["w-full"]: item.stretch,
          })}
        >
          <Button {...item} />
        </div>
      ))}
    </div>
  );
};

export default React.memo(ButtonGroup);