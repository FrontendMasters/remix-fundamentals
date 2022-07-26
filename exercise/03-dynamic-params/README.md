# 03. Dynamic Params

## 📝 Notes

## 🤓 Background

TODO: see what tweet this is and change it to a rick roll or something:

Checkout this link to a tweet:

```
https://twitter.com/kentcdodds/status/1550606109760622592
```

That last long number is a unique identifier for the tweet. It tells twitter which tweet we actually want to view. If we change that identifier, we'll get a different tweet. So you could look at that URL more generically as:

```
https://twitter.com/kentcdodds/status/:tweetId
```

Where `:tweetId` is like a parameter we pass to the twitter status "function". Somewhere on twitter's server is some generic code that handles loading the tweet information based on the `:tweetId`.

In fact, the username in there could be a parameter as well:

```
https://twitter.com/:username/status/:tweetId
```

In Remix, we call `:username` and `:tweetId` a "param" (short for parameters) and there is a filename convention you can follow to place generic code for handling those. For example, if we wanted to create the nested routing structure to handle the tweet, then we would create the following file structure:

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

In the Remix convention, a file with a `$` prefix in the filename indicates a param. In the `$tweetId.tsx` file, you can access the params in the `loader` via the loader's arguments:

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

We'll learn more about nested routing in a future exercise and then we can talk about what would be in some of the other files.

## 💪 Exercise

> Note: we've updated skipped over the "Pulling from a data source" step because that's not
> super relevant for what we're learning today.

## 🗃 Files

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Remix%20Fundamentals&e=3%3A%2003.%20Dynamic%20Params&em=
