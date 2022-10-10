# 08. Error handling

## 📝 Notes

## 🤓 Background

No matter how hard you try, you will experience errors in production. Not only
is it inevitable (systems are imperfect), but we actually expect it to happen.
For example, what if we were building Airbnb and someone went to a house listing
that was deleted? They should get a 404 error in that case.

So the secret to errors is not only to try and prevent them from happening, but
to make sure your code is resilient to them when they do happen.

In Remix, thanks to nested routing, we can have nice contextual errors because
Remix allows us to say: "When this route or its children experience an error,
render this instead!" And we communicate this via another export called
`ErrorBoundary`. For example:

```tsx
export default function UhOhRoute() {
  // Oh no! "candy" is not defined! Should've used TypeScript 🙃
  return <div>{candy.eat}</div>;
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}
```

An important note is that Remix Error Boundaries bubble up to parent routes as
well, so if an error happens in a child route but that route doesn't export an
error boundary, then Remix will look for the closest ancestor that does and
render that one.

And that's all there is to it. You might be familiar with the concept of Error
Boundaries in React. This is similar with an important difference: it works on
the server render as well.

Error Boundaries like this will handle unexpected errors, but what about
expected errors like the `404` case? Well, Remix has another handy feature where
you can `throw` a `Response` in your `loader` or `action`. When this happens,
Remix will catch that and render the nearest `CatchBoundary` component.

```tsx
import type { LoaderArgs } from "@remix-run/node";

export async function loader({ params }: LoaderArgs) {
  const dogo = await getDogo(params.dogoId);
  if (!dogo) {
    throw new Response("not found", { status: 404 });
  }
  // ... etc...
}

export function CatchBoundary() {
  const caught = useCatch();

  // "caught" is the response that was through
  if (caught.status === 404) {
    return <div>Not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
```

Another cool bit of this feature is you can throw a redirect for situations
where a user's not supposed to be somewhere at all. We'll get into doing this
later when we get into auth:

```tsx
throw redirect("/login");
```

## 💪 Exercise

Let's handle errors more contextually for the `/posts/:slug`,
`/posts/admin/:slug`, and the `/posts` routes by adding an `ErrorBoundary` to
those files.

One tricky bit about this is that we have a "hidden" parent route. It's the
parent of all the routes under `/posts`. You'll notice we don't have a
`app/routes/posts.tsx` file, even though we have children under that directory.
We're doing that because we don't need a parent to wrap that UI, so we're
getting the default which is effectively:

```tsx
import { Outlet } from "@remix-run/react";
export default function HiddenParentRoute() {
  return <Outlet />;
}
```

So, if we want to add an error boundary to handle all unhandled errors under
`/posts`, we'll need to create a `/app/routes/posts.tsx` file with that in it
(to get the same functionality) and then we can add the `ErrorBoundary`.

## 🗃 Files

- `app/routes/posts.tsx` <-- you'll create this file
- `app/routes/posts/$slug.tsx`
- `app/routes/posts/admin/$slug.tsx`

## 💯 Extra Credit

### 1. Catch Boundaries

We've handled unexpected errors. Now let's handle expected errors. If someone
navigates to a post that doesn't exist, we should show a more helpful error
message explaining what went wrong.

Add a `CatchBoundary` to both `/app/routes/posts/$slug.tsx` and
`/app/routes/posts/admin/$slug.tsx`. Each has the following code:

```ts
invariant(post, `Post not found: ${params.slug}`);
```

Swap that with:

```ts
throw new Response("not found", { status: 404 });
```

The `CatchBoundary` should be looking for caught responses that are status `404`
and display a helpful error message in that case.

**Files**:

- `app/routes/posts/$slug.tsx`
- `app/routes/posts/admin/$slug.tsx`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Remix%20Fundamentals&e=08.%20Error%20handling&em=
