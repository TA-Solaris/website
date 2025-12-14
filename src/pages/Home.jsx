import { useContext } from "react";
import { PostsContext } from "@/components/posts-provider";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const posts = useContext(PostsContext);

  return (
    <div className="space-y-10">
      {/* Intro section */}
      <section className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Hi, I’m Edward.</h1>
        <p className="text-lg max-w-2xl mx-auto">
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
                <CardTitle className="line-clamp-2 pb-1">{post.title}</CardTitle>
                <CardDescription>{post.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{post.summary}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}

