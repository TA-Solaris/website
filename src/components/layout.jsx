import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export function AppLayout({ children }) {
  return (
    <>
      <Sidebar className="border-r bg-background">
        <SidebarHeader>
          <div className="flex p-3">
            <h2 className="text-lg font-bold">potter-ed.net</h2>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem key={"Home"}>
                  <SidebarMenuButton asChild>
                    <Link to="/">
                      <Home />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <div className="flex-1 relative flex flex-col">
        <header className="sticky top-0 z-50 flex justify-between p-3 border-b bg-background/90 backdrop-blur-md">
          <SidebarTrigger />
          <ModeToggle />
        </header>

        <main className="flex-1 overflow-y-auto max-w-4xl mx-auto p-6">
          {children}
        </main>
      </div>
    </>
  );
}
