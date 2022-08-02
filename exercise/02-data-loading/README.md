# 02. Data Loading

## 📝 Notes

## 🤓 Background

Data loading is built into Remix.

If your web dev background is primarily in the last few years, you're probably
used to creating two things here: an API route to provide data and a frontend
component that consumes it. In Remix your frontend component is also its own API
route and it already knows how to talk to itself on the server from the browser.
That is, you don't have to fetch it.

If your background is a bit farther back than that with MVC web frameworks like
Rails, then you can think of your Remix routes as backend views using React for
templating, but then they know how to seamlessly hydrate in the browser to add
some flair instead of writing detached jQuery code to dress up the user
interactions. It's progressive enhancement realized in its fullest.
Additionally, your routes are their own controller.

The way this works is through a `loader` function that you export from your
route module. That goes hand-in-hand with a `useLoaderData` hook in your
component. For example:

```tsx
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const userId = await requireUserId(request);
  const flights = await getUserFlights(userId);
  return json({ flights }); // <-- send the data from your backend
};

export default function FlightsRoute() {
  const { flights } = useLoaderData(); // <-- get the data into your UI
  return (
    <div>
      <h3>Flights</h3>
      {flights.map((flight) => (
        <div key={flight.id}>{flight.number}</div>
      ))}
    </div>
  );
}
```

There's more to do for that to make TypeScript more helpful, but that's the
gist.

One other tip is that the responsibility of the `loader` is to return a
`Response` object and the `json` function is simply a helper for creating a
`Response` object. It's effectively this:

```tsx
return new Response(JSON.stringify(data), {
  status: 200,
  headers: {
    "Content-Type": "application/json",
  },
});
```

## 💪 Exercise

We're going to start simple by putting our blog posts directly in the loader to
start. Here are the blog posts we need to get from our server to the UI:

```tsx
const data = {
  posts: [
    {
      slug: "my-first-post",
      title: "My First Post",
    },
    {
      slug: "90s-mixtape",
      title: "A Mixtape I Made Just For You",
    },
  ],
};
```

Put that in your loader and then get that from the loader to the component using
`json` and `useLoaderData`. You can render the posts using this JSX:

```tsx
<main>
  <h1>Posts</h1>
  <ul>
    {posts.map((post) => (
      <li key={post.slug}>
        <Link to={post.slug} className="text-blue-600 underline">
          {post.title}
        </Link>
      </li>
    ))}
  </ul>
</main>
```

## 🗃 Files

- `app/routes/posts/index.tsx`

## 💯 Extra Credit

### 1. Help TypeScript help us

The `json` utility is a generic function and accepts a type which you can use to
make sure the types you're using are consistent. We also have a `LoaderArgs`
type which we can use to get nice auto-complete on the `loader` function
arguments. Here's the same example as above but with types.

```tsx
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const flights = await getUserFlights(userId);
  return json({ flights }); // <-- send the data from your backend
}

export default function FlightsRoute() {
  const { flights } = useLoaderData<typeof loader>(); // <-- get the data into your UI
  return (
    <div>
      <h3>Flights</h3>
      {flights.map((flight) => (
        <div key={flight.id}>{flight.number}</div>
      ))}
    </div>
  );
}
```

For this extra credit add `typeof loader` to the `useLoaderData` call (so far we
don't need arguments to our `loader`, but keep `LoaderArgs` in mind for the
future).

**Files**:

- `app/routes/posts/index.tsx`

### 2. Switch to prisma for data

This workshop isn't really about prisma. Remix works with whatever data loading
mechanism you need. So you can just as easily make a `fetch` request directly in
your `loader` to another CMS vs interact directly to your database.

In this workshop we're going to use SQLite with prisma. If you have some extra
time, go ahead and swap our hard-coded data with some calls into `prisma`.

As an extra tip, it's pretty common practice to put interaction with database
models in a special module responsible for that specifically, so you can create
a file at `app/models/posts.server.ts` and put a `getPosts` function in that.
We'll be adding more functions to that module soon.

**Files**:

- `app/models/post.server.ts`
- `app/routes/posts/index.tsx`

### 3. Optimize data loading

One cool thing about running on the server is we can trim down the data that our
`loader` sends to only the stuff we want. Whether it's coming from a third party
API we're hitting with `fetch` or a database call, we can fine-tune the data we
return from the `loader` to only the stuff we need in our component.

Let's use prisma's querying API to limit what we get from the database to just
the data our UI needs. In fact, we can rename `getPosts` to `getPostListItems`
to more accurately reflect what it's doing.

Here's an example of what we can do with prisma's querying API:

```tsx
prisma.dogo.findMany({ select: { id: true, name: true } });
```

See if you can reduce the amount of data over the wire when you navigate to the
post listing page.

**Files**:

- `app/models/post.server.ts`
- `app/routes/posts/index.tsx`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Remix%20Fundamentals&e=02.%20Data%20Loading&em=
