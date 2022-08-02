# 09. ENV Variables

## 📝 Notes

## 🤓 Background

Because we have a Node.js server at runtime, most use cases for environment
variables are satisfied by
[`process.env`](https://nodejs.org/api/process.html#processenv). However,
sometimes we have a need for an environment variable to be used in the client.
For example, on my own site you can connect your KCD user account with your
discord account. To do that I need to have my `DISCORD_CLIENT_ID` in both the
server (for the server-render) and the client (for generating the discord
connection URL).

Because `process.env` is a Node.js runtime thing, it's not accessible in React
components which will be hydrated on the client. So this won't work:

```tsx
function DiscordConnectionRoute() {
  return (
    <a href={createDiscordUrl(process.env.DISCORD_CLIENT_ID)}>
      Connect Discord
    </a>
  );
}
```

It'll work on the server, but it'll blow up on the client. And that's actually a
good thing. We wouldn't want all our `process.env` to go to the client. Only
specific information that's ok for the public to have access to.

So how do we get that data from our server to the client? Well, it turns out
that environment variables are no different from any other data our server can
send to our client. We can send it via the `loader`!

```tsx
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  return json({
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  });
}

function DiscordConnectionRoute() {
  const { DISCORD_CLIENT_ID } = useLoaderData<typeof loader>();
  return <a href={createDiscordUrl(DISCORD_CLIENT_ID)}>Connect Discord</a>;
}
```

This works fine for simple cases, but I want to show you a handy trick. This
trick allows us to access these environment variables globally. This is useful
because environment variables are (or at least should be) immutable and globally
accessible. So how do you make something globally accessible in the client?
That's right, put it on `window`! So what you can do is add a `script` tag that
sets a variable on the window. So check this out:

```tsx filename=app/root.tsx
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  return json({
    ENV: {
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    },
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html>
      {/* ... */}
      <body>
        {/* ... */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)};`,
          }}
        />
      </body>
    </html>
  );
}
```

Now remember, our components run on both the client _and_ the server, so if we
really want this to be accessible globally, we need to set this on the server as
well. So you can pop open your `app/entry.server.tsx` and set it on `global` for
Node.js:

```tsx
global.ENV = {
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
};
```

Sweet! And now you can use that variable in any context and it will be globally
available. So this should work (remember, this code runs both on the server and
client):

```tsx
function DiscordConnectionRoute() {
  return <a href={createDiscordUrl(ENV.DISCORD_CLIENT_ID)}>Connect Discord</a>;
}
```

**Important note**: using globals like this is strongly discouraged for things
that can change as the application runs or for things that are unique on a
per-user basis. Also keep in mind that doing this makes these values accessible
to the client, so make sure you only include values that you're ok the user
knowing.

To take things further, we can package this up in a function and use that
function instead of hard-coding it in two places. And we can make it typesafe as
well so you'll get autocomplete when typing `ENV.` 🔥

## 💪 Exercise

This example is a tiny bit contrived. In an upcoming exercise, we want to make
sure that only the admin user can create blog posts. We're going to configure
who the admin user is via an environment variable called `ADMIN_EMAIL`. Normally
you'd want this to only be a server-side environment variable (so
`process.env.ADMIN_EMAIL` would be sufficient), but we're going to share this
environment variable with the client-side.

Start out by creating an `env.server.ts` file that exports a `getEnv` function
which returns all the environment variables we want shared between the frontend
and the backend:

```ts
export function getEnv() {
  return {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  };
}
```

Now you can use that to set the variables to both the server and the client.

## 🗃 Files

- `app/env.server.ts` <-- you create this
- `app/entry.server.tsx`
- `app/root.tsx`

## 💯 Extra Credit

### 1. Help TypeScript help us

You need to do three things for fancy auto-complete and type checking of this
global `ENV` variable:

1. Use `invariant` inside `getEnv` to assert that the environment variable is
   set
2. Get the type of ENV from `ReturnType<typeof getEnv>`
3. Stick `ENV` on the global for both server and browser code.

That third one is a bit trickier if you've never done it before so I'm going to
give it to you:

```ts
// App puts these on
declare global {
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
```

Give that a shot and see if you can get autocomplete for global environment
variables.

**Files**:

- `app/env.server.tsx`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Remix%20Fundamentals&e=09.%20ENV%20Variables&em=
