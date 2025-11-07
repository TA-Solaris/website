import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [html, setHtml] = useState("");

  useEffect(() => {
    fetch("/posts.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.slug === slug);
        setPost(found);
      });

    fetch(`/posts/${slug}.html`)
      .then((res) => res.text())
      .then(setHtml);
  }, [slug]);

  if (!post) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="space-y-6">
      {post.cover && (
        <img
          src={post.cover}
          alt={post.title}
          className="rounded-lg w-full max-h-[400px] object-cover shadow"
        />
      )}

      <header className="space-y-3">
        <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>
        <p className="text-gray-500">{post.date}</p>
      </header>

      <div className="mb-2">
        <Link to="/">
          <Button variant="outline">← Back to Home</Button>
        </Link>
      </div>

      <Separator />

      <article
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

