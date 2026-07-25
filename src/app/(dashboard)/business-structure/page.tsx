import { PageShell } from "@/components/layout/page-shell";
import { getNavItem } from "@/lib/nav-config";

export default function Page() {
  const item = getNavItem("/business-structure");
  return (
    <PageShell
      eyebrow={item.group}
      title={item.title}
      description={item.description}
      icon={item.icon}
      comingSoon={item.comingSoon}
    />
  );
}
