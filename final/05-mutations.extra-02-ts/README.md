# 05. Mutations

## 📝 Notes

## 🤓 Background

Getting data onto the page is the easy part. Remix has great APIs and
conventions for it. For a very small number of small websites, this is enough.
But most web applications require mutations of some kind. The user wants to be
able to change the data. "All you have to do" is create a `<form />`, add a
`onSubmit` with `event.preventDefault()` and off you go, right? Nah... This is
where things typically get pretty complicated.

The problem is you can't just make a network request to change the data. You
also have to update the data you already loaded onto the page. For example, what
if you're building a chat app and there's a list of unread messages as well as a
total at the top. You can't just mark a message as read. You also have to update
the total.

If you've been working in the frontend in the last few years, you're probably
starting to think about bringing in your favorite application state management
library. Redux, MobX, Apollo, React Query, etc. These each come with their own
set of trade-offs and challenges. It's a complicated problem (as evidenced by
the number of options).

In Remix, we like to take steps back... A _lot_ of steps. Some of us have been
around long enough to remember when web development wasn't so difficult. Back in
early days of the web, when the user made a mutation (using a `<form />`
_without_ `event.preventDefault()`), the browser would serialize the user inputs
and submit it automatically. Then the backend would process it and either send
back the new (up-to-date) HTML or tell the browser where to go next (to get
up-to-date) HTML.

The mental model was _so_ simple. The problem is replacing your HTML wholesale
like that is not the best UX. Can you imagine getting a full-page refresh every
time you favorited a tweet? But maybe there's a way that we can have the old,
simpler mental model with the modern UX our users have grown accustomed to?
Kinda like a **remix** of the old with the new 😏

This is one of the main things that makes Remix so special. In Remix, you don't
actually need a state management library to handle these things. Remix handles
your mutations and ensures your data is up-to-date after mutations are finished
doing their mutating.

Here's a simple example of how to use the conventional API for this:

```tsx app/routes/dogo/new.tsx
import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { createNewDogo } from "~/models/dogo.server";

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData(); // <-- 📜 learn more https://mdn.io/formData
  const name = formData.get("dogo-name");
  const newDogo = await createNewDogo({ name });
  return redirect(`/dogo/${newDogo.id}`);
}

export default function NewDogoRoute() {
  return (
    <Form method="post">
      <label>
        Name: <input name="dogo-name" />
      </label>
      <button type="submit">Create Dogo</button>
    </Form>
  );
}
```

There is a tiny bit more to it once you want to start thinking about pending UI
(which we'll get to next), but that's the basic idea. You've got a `Form` with
`method="post"` and some form elements and when it's submitted, Remix will call
your `action` with the request which you can use to get the form data.

> 🦉 Note that without the `method="post"`, the HTTP method will be a "GET"
> which will cause your `loader` to be called instead. There are use cases for
> this, but that's outside the scope of this workshop.

## 💪 Exercise

We want to be able to create blog posts. So let's flesh out the `new.tsx` file a
bit. Again, this isn't a React workshop and I don't want you wasting your time
writing out JSX, so I've given you the starting point for the form.

You'll need to add the `action` and create a `createPost` function in your
`post.server.ts` file that accepts the `title`, `slug`, and `markdown`.

## 🗃 Files

- `app/models/post.server.ts`
- `app/routes/posts/admin/new.tsx`

## 💯 Extra Credit

### 1. Error handling

Sometimes users make errors. Before we try to submit their data to the database,
we should probably make sure their data is error-free so we can send back a
handy error message. To communicate back from the `action` to the form, we use a
hook called `useActionData`. If we add error handling to our earlier example
it'd be something like this:

```tsx app/routes/dogo/new.tsx
import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { createNewDogo } from "~/models/dogo.server";

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData(); // <-- 📜 learn more https://mdn.io/formData
  const name = formData.get("dogo-name");
  if (typeof name !== "string" || !name) {
    return json({ name: "Dogo name is required" });
  }
  if (name.length < 2 || name.length > 12) {
    return json({ name: "Dogo name must be between 2 and 12 characters" });
  }
  const newDogo = await createNewDogo({ name });
  return redirect(`/dogo/${newDogo.id}`);
}

export default function NewDogoRoute() {
  const errors = useActionData();
  return (
    <Form method="post">
      <label>
        Name: <input name="dogo-name" />
        {errors?.name ? <em className="text-red-600">{errors.name}</em> : null}
      </label>
      <button type="submit">Create Dogo</button>
    </Form>
  );
}
```

Go ahead and handle errors for our little app. All three fields are required. If
any of them has an error, we should display an error for the user.

### 2. Help TypeScript help us

Let's take a second to let TypeScript help us out here. First, let's fix
`createPost` to accept the right types for `slug`, `title`, and `markdown`
(strings), then you'll need to make sure that our action asserts those values
from the `formData` are all `string`s.

Similar to the `loader` function, the `action` export's arguments can be typed
via `ActionArgs` which you can get from `@remix-run/node`.

Finally, the `useActionData` is a generic similar to `useLoaderData`, so you can
use it like: `useActionData<typeof action>` and it'll give you some nice type
inference.

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Remix%20Fundamentals&e=05.%20Mutations&em=
