# 03. Dynamic Params

## 📝 Notes

## 🤓 Background

Checkout this link to a tweet:

```
https://twitter.com/kentcdodds/status/1509892236032413702
```

That last long number is a unique identifier for the tweet. It tells twitter
which tweet we actually want to view. If we change that identifier, we'll get a
different tweet. So you could look at that URL more generically as:

```
https://twitter.com/kentcdodds/status/:tweetId
```

Where `:tweetId` is like a parameter we pass to the twitter status "function".
Somewhere on twitter's server is some generic code that handles loading the
tweet information based on the `:tweetId`.

In fact, the username in there could be a parameter as well:

```
https://twitter.com/:username/status/:tweetId
```

In Remix, we call `:username` and `:tweetId` a "param" (short for parameters)
and there is a filename convention you can follow to place generic code for
handling those. For example, if we wanted to create the nested routing structure
to handle the tweet, then we would create the following file structure:

```
.
└── app
    ├── entry.client.tsx
    ├── entry.server.tsx
    ├── root.tsx
    └── routes
        ├── $username
        │   └── status
        │       └── $tweetId.tsx
        └── $username.tsx
```

In the Remix convention, a file with a `$` prefix in the filename indicates a
param. In the `$tweetId.tsx` file, you can access the params in the `loader` via
the loader's arguments:

```tsx
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getTweet } from "~/models/tweets";

export async function loader({ params }: LoaderArgs) {
  return json({
    tweet: await getTweet(params.username, params.tweetId),
  });
}
```

You can also access the params in your components via the `useParams` hook:

```tsx
import { useLoaderData, useParams } from "@remix-run/react";

export default function Tweet() {
  const { username, tweetId } = useParams();
  const data = useLoaderData<typeof loader>();

  return <div>{/* render tweet */}</div>;
}
```

We'll learn more about nested routing in a future exercise and then we can talk
about what would be in some of the other files.

## 💪 Exercise

Let's make the blog post page so we can read this sweet sweet content. Create a
file in `app/routes/posts/$slug.tsx` (our param will be called `slug`).

In that file you'll need a `loader` that uses the `slug` param to find the blog
post by its slug (you'll create a new function for that in the `post.server.ts`
file).

From there, your default export component can be something simple like this:

```tsx
<main className="mx-auto max-w-4xl">
  <h1 className="my-6 border-b-2 text-center text-3xl">{post.title}</h1>
</main>
```

## 🗃 Files

- `app/models/post.server.ts`
- `app/routes/posts/$slug.tsx` <-- you create this file

## 💯 Extra Credit

### 1. Add post content

Our post content is written in [markdown](https://www.markdownguide.org/). Let's
convert that into HTML so we can have links and things rendered properly.

We're going to use a simple tool for this called
[`marked`](https://npm.im/marked).

It's already installed, all you need to do is use it. Here's a quick example of
how to use it:

```tsx
// import marked
import { marked } from "marked";

// use it with some HTML

const html = marked(`
# Hello world

This is some **bold** text!
`);

// use that HTML in a React component

function MyComponent({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

You may be concerned about that `dangerously` part of `dangerouslySetInnerHTML`.
React does cross-site scripting (XSS) mitigation for you automatically. This
ensures that you're safe when you do something like this
`<div>{userSubmittedContent}</div>`. For example, if React did not do this and
`userSubmittedContent` were something other users of our app can modify and
someone submitted a string of text like: `<script>alert("gotcha!")</script>`
then we could be in trouble.

However, in our case, we're the author of our own blog posts so we're safe to
use this escape hatch, so no worries!

**Files**:

- `app/models/post.server.ts`
- `app/routes/posts/$slug.tsx`

### 2. Help TypeScript help us

We've got a few spots where TypeScript is upset at us. One of them is the use of
`params.slug`. The way that's typed by Remix says it could be
`string | undefined`. This is correct. Even though Remix will ensure that
`params.slug` will be a `string` because our file is called `$slug.tsx`,
TypeScript doesn't understand that convention. So we need to help it a bit. You
can use regular type guards like this:

```ts
const { slug } = params;
if (!slug) throw new Error("This should be impossible");
// now slug is a string only
```

That works fine, but I want to show you another package called
[`tiny-invariant`](https://npm.im/tiny-invariant) which can be used to do
runtime type checking like that. Checkout the docs for that package (it's
already installed) and make TypeScript happy about things.

We'll also want to do the same for if no post is found by the given slug in the
database. We'll deal with a proper `404` status code and error page later.

**Files**:

- `app/models/post.server.ts`
- `app/routes/posts/$slug.tsx`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Remix%20Fundamentals&e=03.%20Dynamic%20Params&em=
