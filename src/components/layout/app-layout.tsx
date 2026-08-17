import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { DashboardTopbar } from "./dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

export function AppLayout({ children, pageTitle }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex">
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {/* Sidebar - Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative h-full w-64 max-w-[80vw]">
            <Sidebar className="w-full" />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard Topbar */}
        <DashboardTopbar 
          pageTitle={pageTitle}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          isMobileMenuOpen={mobileMenuOpen}
        />

        {/* Content area */}
        <main className="flex-1 overflow-auto px-2.5 py-4 md:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}