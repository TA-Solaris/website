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
import { Home, Newspaper, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useContext } from "react";
import { PostsContext } from "@/components/posts-provider";

export function AppLayout({ children }) {
  const posts = useContext(PostsContext);

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

                <Collapsible defaultOpen className="group/collapsible">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuItem key={"Posts"}>
                      <SidebarMenuButton>
                        <Newspaper />
                        Posts
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {posts.map((post) => (
                      <SidebarMenuItem key={post.slug}>
                        <SidebarMenuButton asChild>
                          <Link to={`/post/${post.slug}`}>
                            <span>{post.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
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
