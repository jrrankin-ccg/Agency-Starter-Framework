import { Button } from "../../components/buttons/Button";
import { IconLoader } from "../../components/images/IconLoader";
import { backgroundClasses, textClasses } from "../../theme";
import { LanguageSwitch } from "./LanguageSwitch";
import { NavigationProps } from "./Navigation";
import * as RadixDialog from "@radix-ui/react-dialog";
import * as RadixNavigationMenu from "@radix-ui/react-navigation-menu";
import cx from "classnames";
import React from "react";

export type MobileNavProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} & NavigationProps;

export const MobileNav = ({
  items,
  buttons,
  open,
  theme,
  onOpenChange,
}: MobileNavProps) => {
  return (
    <div
      className={cx(
        "radix-dialog",
        { ["hidden"]: !open },
        theme?.block?.text && textClasses[theme?.block?.text],
      )}
    >
      <RadixDialog.Root onOpenChange={onOpenChange} open={open}>
        <RadixDialog.Overlay className="relative">
          <div className="fixed inset-0 bg-black/20 w-screen h-screen z-50" />
        </RadixDialog.Overlay>
        <RadixDialog.Content className="z-[60] fixed top-0 right-0 w-screen max-w-xs h-screen">
          <div className="h-full">
            <div className="h-full">
              <RadixDialog.Title className="sr-only">
                Navigation
              </RadixDialog.Title>
              <RadixDialog.Close className="z-[60] py-3 px-3 absolute top-2 right-2">
                <IconLoader icon="close" className="w-6 h-6 block" />
              </RadixDialog.Close>

              <RadixNavigationMenu.Root
                className={cx(
                  "h-full overflow-y-auto overflow-scrolling-touch select-none shadow-2xl text-xl",
                  theme?.block?.background &&
                    backgroundClasses[theme?.block?.background],
                  theme?.block?.text && textClasses[theme?.block?.text],
                )}
              >
                {Boolean(items?.length) && (
                  <RadixNavigationMenu.List className="pt-20 px-2">
                    {items?.map((item) => (
                      <RadixNavigationMenu.Item key={item._key}>
                        <details
                          open={item.current}
                          className="mt-0.5 py-3 px-4 group"
                        >
                          <summary className="list-none relative">
                            <Button
                              {...item.button}
                              as={item?.button?.href ? "a" : "span"}
                              className={cx("!p-0", {
                                ["!underline current"]: item?.current,
                              })}
                            />

                            {Boolean(item.children?.length) && (
                              <IconLoader
                                icon="chevrondown"
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 transition-transform duration-75 group-open:rotate-180"
                              />
                            )}
                          </summary>

                          {Boolean(item?.children?.length) && (
                            <ul className="flex flex-col gap-2 py-3">
                              {item?.children?.map((item) => (
                                <li key={item._key}>
                                  <Button
                                    {...item}
                                    as={item?.href ? "a" : "span"}
                                    className={cx("!p-0", {
                                      ["!underline current"]: item?.current,
                                    })}
                                  />
                                </li>
                              ))}
                            </ul>
                          )}
                        </details>
                      </RadixNavigationMenu.Item>
                    ))}
                  </RadixNavigationMenu.List>
                )}

                <RadixNavigationMenu.List className="mt-3 p-4 flex flex-row gap-3">
                  <LanguageSwitch
                    align="left"
                    position="above"
                    theme={{
                      background: theme?.submenu?.background || "white",
                    }}
                  />
                  {Boolean(buttons?.length) &&
                    buttons?.map((button) => (
                      <RadixNavigationMenu.Item key={button._key}>
                        <Button {...button} />
                      </RadixNavigationMenu.Item>
                    ))}
                </RadixNavigationMenu.List>

                <div className="h-16" />
              </RadixNavigationMenu.Root>
            </div>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Root>
    </div>
  );
};
