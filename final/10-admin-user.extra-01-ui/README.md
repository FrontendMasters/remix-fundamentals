# 10. Admin user

## 📝 Notes

## 🤓 Background

Most apps have some level of protection that certain routes need. For example,
the user who tweeted a tweet should be able to edit that tweet, but not anybody
else 🙄 Or maybe only an admin user can access and modify data. You may even
have more complicated permissions and role-based authorization in place.

Whatever the case may be, you're probably going to need to protect a user's
information.

It's easy to forget, but important to remember, that every route that exports a
`loader` / `action` in your Remix app is an API endpoint. This means that people
can hit those endpoints directly (via `cURL` for example). It's also important
to remember that Remix runs all of your `loader`s concurrently.

This is why you can't just add protection to a parent route's `loader` and
assume everything else is safe. Because that parent loader and all its children
will be run at the same time. The child won't wait for the parent to do the
check before starting to handle the request. Additionally, when the user
navigates between sibling routes within a single parent, the parent route's
loader won't even be called.

In the future, Remix will have a better answer for this specific use case. But
yes, in a Remix app current, you have to add protection to every `loader` and
`action` that needs it. If you really want, you can get around this today by
integrating Remix with another routing server that supports middleware like
`express` and do the check before the request makes it to Remix.

Ok, that said, how do we protect a route? Most of the time, you want to redirect
the user to the `/login` route if they're trying to access something that
requires a login. Remember how you can throw responses? Well, you can throw a
`redirect` response and Remix will send that along to the user. This is awesome
because it means you can perform a check and not worry about whether code will
continue to execute. The `throw` stops the execution.

So, here's a simple example:

```tsx
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  const userIsAllowed = await userHasPermission(request, "emails.write");
  if (!userIsAllowed) {
    throw redirect("/login");
  }
  // otherwise, we're good... keep going...
  return json({});
}
```

Ok, so what makes this especially awesome though is that this means you can
abstract that bit into a function:

```tsx
async function requireUserPermission(request: Request, permission: string) {
  const userIsAllowed = await userHasPermission(request, permission);
  if (!userIsAllowed) {
    throw redirect("/login");
  }
}

export async function loader({ request }: LoaderArgs) {
  await requireUserPermission("emails.write");
  return json({});
}
```

How cool is that!? I think it's pretty cool. Let's apply this to our own app.

## 💪 Exercise

We want to protect every route under `/posts/admin`. First we want to make an
abstraction for this in `app/session.server.ts`. Then we'll use that abstraction
in the other routes. Remember to apply it to both the `loader` and `action`
functions.

NOTE, the `ADMIN_EMAIL` is set in the `.env` file as `kody@remix.run`. The
`prisma/seed.ts` script sets that user's password to `kodylovesyou`.

## 🗃 Files

- `app/session.server.ts`
- `app/routes/posts/admin.tsx`
- `app/routes/posts/admin/index.tsx`
- `app/routes/posts/admin/$slug.tsx`

## 💯 Extra Credit

### 1. Hide admin links

Let's make a `useOptionalAdminUser` function in `app/utils.ts` which returns the
user if they're the admin user (otherwise it returns `undefined`). We can use
the existing `useOptionalUser` and compare the user's email to the
`ENV.ADMIN_EMAIL`.

With that, we can conditionally render the link to `/posts/admin` in
`app/routes/posts/index.tsx` and we can even add an edit link to the bottom of
the posts `app/routes/posts/$slug.tsx` if we're signed in.

**Files**:

- `app/utils.ts`
- `app/routes/posts/index.tsx`
- `app/routes/posts/$slug.tsx`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Remix%20Fundamentals&e=10.%20Error%20handling&em=
