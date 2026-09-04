import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { Home, Newspaper } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { PostsContext } from "@/components/posts-context";

export function AppLayout({ children }) {
  const { posts } = useContext(PostsContext);
  const { pathname } = useLocation();
  const [visiblePostCount, setVisiblePostCount] = useState(5);

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

                <SidebarMenuItem key={"Posts"}>
                  <SidebarMenuButton asChild>
                    <Link to="/posts">
                      <Newspaper />
                      <span>Posts</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {posts.slice(0, visiblePostCount).map((post) => (
                      <SidebarMenuSubItem key={post.slug}>
                        <SidebarMenuSubButton asChild>
                          <Link to={`/post/${post.slug}`}>
                            <span>{post.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                    {visiblePostCount < posts.length && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          className="w-full cursor-pointer"
                        >
                          <button
                            type="button"
                            aria-label="Show 5 more posts"
                            onClick={() =>
                              setVisiblePostCount((count) => count + 5)
                            }
                          >
                            …
                          </button>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
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

        <main
          className={`flex flex-1 w-full flex-col overflow-y-auto p-6 mx-auto ${
            pathname === "/posts" ? "max-w-none" : "max-w-4xl"
          }`}
        >
          {children}
        </main>
      </div>
    </>
  );
}
