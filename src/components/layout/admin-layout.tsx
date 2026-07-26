import { ReactNode, useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { useAuth } from "@/hooks/use-auth";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  pageName?: string; // Should match the name in adminNavigationItems (e.g. "Users", "Jobs")
}

export function AdminLayout({ children, pageTitle, pageName }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  const isAuthorized = !pageName || hasPermission(pageName);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex">
        <AdminSidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {/* Sidebar - Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative">
            <AdminSidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Topbar */}
        <AdminTopbar 
          pageTitle={pageTitle}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          isMobileMenuOpen={mobileMenuOpen}
        />

        {/* Content area */}
        <main className="flex-1 overflow-auto p-6">
          {!isAuthorized ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShieldAlert className="h-16 w-16 text-red-500 mb-2" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
              <p className="text-gray-500 max-w-md">
                You do not have permission to view the {pageName} page. If you believe this is a mistake, please contact a super administrator.
              </p>
              <Button onClick={() => navigate("/admin-dashboard")} className="mt-4 bg-yellow-500 hover:bg-yellow-600">
                Return to Dashboard
              </Button>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}