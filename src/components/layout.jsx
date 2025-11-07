import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";

export function AppLayout({ children }) {
  return (
    <>
      <Sidebar className="border-r bg-background">
        <SidebarHeader>
          <div className="flex p-3">
            <h2 className="text-lg font-bold">potter-ed.net</h2>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3">
          {/* TODO */}
        </SidebarContent>
      </Sidebar>

      <div className="flex-1 flex flex-col">
        <header className="flex justify-end gap-2 p-3 border-b">
          <ModeToggle />
        </header>

        <main className="flex-1 overflow-y-auto max-w-4xl mx-auto p-6">{children}</main>
      </div>
    </>
  );
}
