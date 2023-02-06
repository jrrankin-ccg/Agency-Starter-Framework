import { Breadcrumb } from "../../components/breadcrumb/Breadcrumb";
import { isLanguage } from "../../languages";
import { usePathname } from "next/navigation";

export const FooterBreadcrumb = () => {
  const pathname = usePathname() || "";
  const isHomepage = pathname === "/" || isLanguage(pathname?.replace("/", ""));
  if (isHomepage) return null;

  return (
    <div className="pb-4 mb-4 border-b border-b-neutral-200 text-base text-neutral-500">
      <Breadcrumb />
    </div>
  );
};