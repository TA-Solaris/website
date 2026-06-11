import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { applyMarkdownNoticeBlocks } from "@/lib/markdown-notices";
import {
  applySyntaxHighlighting,
  updateCodeBlockActionSpacing,
} from "@/lib/syntax-highlighting";

function applyPostMarkup(html) {
  const template = document.createElement("template");
  template.innerHTML = html;

  applyMarkdownNoticeBlocks(template.content);
  applySyntaxHighlighting(template.content);

  return template.innerHTML;
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  textarea.style.left = "-1000px";

  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();

  return Promise.resolve();
}

export default function Post() {
  const { slug } = useParams();
  const articleRef = useRef(null);
  const [post, setPost] = useState(null);
  const [html, setHtml] = useState("");
  const [progress, setProgress] = useState(13)
  const siteTitle = "Edward Potter's Blog";

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, []);

  useEffect(() => {
    fetch("/posts.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.slug === slug);
        setPost(found);
      });

    fetch(`/posts/${slug}.html`)
      .then((res) => res.text())
      .then((markup) => setHtml(applyPostMarkup(markup)));
  }, [slug]);

  useEffect(() => {
    if (!post?.title) return;
    document.title = `${post.title} - ${siteTitle}`;
    return () => {
      document.title = siteTitle;
    };
  }, [post, siteTitle]);

  useEffect(() => {
    if (!html || !articleRef.current) return;

    const article = articleRef.current;
    let frame = null;

    const updateSpacing = () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        updateCodeBlockActionSpacing(article);
        frame = null;
      });
    };

    updateSpacing();
    window.addEventListener("resize", updateSpacing);

    const resizeObserver =
      "ResizeObserver" in window ? new ResizeObserver(updateSpacing) : null;
    resizeObserver?.observe(article);

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("resize", updateSpacing);
      resizeObserver?.disconnect();
    };
  }, [html]);

  if (!post) return <Progress value={progress} />;

  function handleArticleClick(event) {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest(".copy-code-button");
    if (!button) return;

    const code = button.closest("pre")?.querySelector("code");
    if (!code?.textContent) return;

    copyText(code.textContent)
      .then(() => {
        button.textContent = "Copied";
        button.dataset.copied = "true";
      })
      .catch(() => {
        button.textContent = "Failed";
      })
      .finally(() => {
        window.setTimeout(() => {
          button.textContent = "Copy";
          delete button.dataset.copied;
        }, 1600);
      });
  }

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
        <Button asChild variant="outline" className="cursor-pointer">
          <Link to="/">← Back to Home</Link>
        </Button>
      </div>

      <Separator />

      <article
        ref={articleRef}
        className="prose prose-slate dark:prose-invert max-w-none space-y-4"
        onClick={handleArticleClick}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
