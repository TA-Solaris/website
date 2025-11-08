import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Post from "./pages/Post";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppLayout } from "./components/layout";
import { PostsProvider } from "@/components/posts-provider";

function App() {

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SidebarProvider>
        <PostsProvider>
          <Router>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/post/:slug" element={<Post />} />
              </Routes>
            </AppLayout>
          </Router>
        </PostsProvider>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App
