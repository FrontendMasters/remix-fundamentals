import { marked } from "marked";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useCatch, useLoaderData, useParams } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Post } from "~/models/post.server";
import { getPost } from "~/models/post.server";
import { useOptionalAdminUser } from "~/utils";

type LoaderData = { post: Post; html: string };

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);
  if (!post) {
    throw new Response("not found", { status: 404 });
  }

  const html = marked(post.markdown);
  return json<LoaderData>({ post, html });
};

export default function PostSlug() {
  const { post, html } = useLoaderData() as LoaderData;
  const adminUser = useOptionalAdminUser();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {adminUser ? (
        <Link
          to={`/posts/admin/${post.slug}`}
          className="text-blue-600 underline"
        >
          Edit
        </Link>
      ) : null}
    </main>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();

  if (caught.status === 404) {
    return <div>There was no blog post found with the slug {params.slug}</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
