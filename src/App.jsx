import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppLayout } from "./components/layout";
import { PostsProvider } from "@/components/posts-provider";
import { Skeleton } from "@/components/ui/skeleton";

const Home = lazy(() => import("./pages/Home"));
const Post = lazy(() => import("./pages/Post"));

function RouteSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-5/6" />
      <div className="grid gap-6 sm:grid-cols-2">
        <Skeleton className="h-72 w-full rounded-lg" />
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
    </div>
  );
}

function App() {

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SidebarProvider>
        <PostsProvider>
          <Router>
            <AppLayout>
              <Suspense fallback={<RouteSkeleton />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/post/:slug" element={<Post />} />
                </Routes>
              </Suspense>
            </AppLayout>
          </Router>
        </PostsProvider>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App
