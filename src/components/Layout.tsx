import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <SidebarTrigger className="ml-3" />
            <span className="ml-3 font-mono text-sm tracking-wider text-muted-foreground">
              RESIDENT EVIL <span className="text-re-red font-bold">ANALYTICS</span>
            </span>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
