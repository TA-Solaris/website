import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/posts.json")
      .then(res => res.json())
      .then(data => setPosts(data.slice(0, 10)));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        setPage((p) => p + 1);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/posts.json")
      .then(res => res.json())
      .then(data => setPosts(data.slice(0, page * 10)));
  }, [page]);

  return (
    <div className="space-y-10">
      {/* Intro section */}
      <section className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Hi, I’m Edward.</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          I’m a software developer based in the UK, working in web development.
          This blog is where I share ideas, thoughts, and notes from my projects.
        </p>
      </section>

      <Separator />

      {/* Posts list */}
      <section className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Link to={`/post/${post.slug}`} key={post.slug}>
            <Card className="transition-all hover:shadow-lg hover:scale-[1.01] pt-0">
              {post.cover && (
                <img
                  src={post.cover}
                  alt={post.title}
                  className="rounded-t-lg object-cover object-center w-full h-48"
                />
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription>{post.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-3">{post.summary}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}

