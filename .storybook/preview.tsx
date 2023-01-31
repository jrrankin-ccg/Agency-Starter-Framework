import { PageContext } from "../context/PageContext";
import { SiteContext } from "../context/SiteContext";
import "../styles/plyr-custom.css";
import "../styles/plyr.css";
import "../styles/styles.css";
import * as NextImage from "next/image";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const OriginalNextImage = NextImage.default;
Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => (
    <OriginalNextImage {...props} unoptimized loader={({ src }) => src} />
  ),
});

const queryClient = new QueryClient();

export const decorators = [
  (Story) => {
    return (
      <QueryClientProvider client={queryClient}>
        <SiteContext.Provider
          value={{
            config: { general: {} },
          }}
        >
          <PageContext.Provider
            value={{
              isPreviewMode: false,
              language: "en",
              sitemapItem: {
                _id: "xx",
                _type: "page.content",
                _updatedAt: "2022-01-04T14:26:24Z",
                path: "/page1",
                title: "Page 1",
                paths: {
                  en: "/",
                  it: "/",
                  es: "/",
                },
                titles: {
                  en: "/",
                  it: "/",
                  es: "/",
                },
              },
              breadcrumb: [],
            }}
          >
            <Story />
          </PageContext.Provider>
        </SiteContext.Provider>
      </QueryClientProvider>
    );
  },
];
