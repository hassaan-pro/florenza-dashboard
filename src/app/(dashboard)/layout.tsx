import { AppSidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { InstagramPostsProvider } from "@/lib/instagram-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InstagramPostsProvider>
      <div className="min-h-screen">
        <AppSidebar />
        <div className="md:pl-64 flex flex-col min-h-screen">
          <Topbar />
          <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
        </div>
      </div>
    </InstagramPostsProvider>
  );
}
