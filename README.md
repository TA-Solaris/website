# Edward Potter's Blog Website

This is a repository for my blog website. It is written using React with Vite. I
use shadcn for the UI elements with tailwindcss. Blog posts are generated from
Markdown files.

## Running the project locally

I'm using Node v24.9.0, but probably runs on a lot of versions. Run locally with
the following:

```bash
npm run dev
```

## Generate blog posts

To generate the blog post HTML's, run the following command:

```bash
npm run build:posts
```

They will not be deleted automatically if the source Markdown is removed.

## Deployment

Deployments are automatic using a Cloudflare Worker. Deployments are triggered
on pushing to the main branch.
