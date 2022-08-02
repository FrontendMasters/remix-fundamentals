import { marked } from "marked";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useCatch, useLoaderData, useParams } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPost } from "~/models/post.server";
import { ErrorFallback } from "~/components";
import { useOptionalAdminUser } from "~/utils";

export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);
  if (!post) {
    throw new Response("not found", { status: 404 });
  }

  const html = marked(post.markdown);
  return json({ post, html });
}

export default function PostSlug() {
  const { post, html } = useLoaderData<typeof loader>();
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
    return (
      <ErrorFallback>
        There was no blog post found with the slug "{params.slug}"
      </ErrorFallback>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <ErrorFallback>There was a problem. Sorry.</ErrorFallback>;
}
