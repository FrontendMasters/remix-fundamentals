# 06. Progressive Enhancement

## 📝 Notes

## 🤓 Background

I've got a surprise for you... Did you know that we can completely disable
client-side JavaScript on this app and it'll still work? Give it a try! Go to
`app/root.tsx` and comment out the `<Scripts />` component. Try creating a post
and check it out!

How does this black magic work?! The answer is simple: Progressive Enhancement!

Turns out the browser actually is pretty capable without client-side JS to help
it out. It knows how to encode user input and make a POST request with that as
the post body. So what Remix did was say "hey, let's just make sure when the
browser does its thing, we'll handle it the same way we do when there _is_
client-side JS."

Remix will handle a browser's POST request and route it to the appropriate
action. The action then sends back a redirect and the browser will follow that,
or the action responds with JSON and Remix will run your app as if a new request
has been made and respond with the new HTML which the browser will then render.

So it begs the question: why have client-side JavaScript at all? Well, it's
because without it, every request triggers a full reload of the page which is
not the best user experience. Also, animated transitions, error messages, focus
management, and intelligent pre-fetching are all only possible with client-side
JavaScript. And because Remix is a JavaScript web framework, the developer
experience of working with client-side JavaScript is fantastic and really just
additive.

Let's take pending UI as an example of enhancing the user's experience thanks to
JavaScript. Without client-side JavaScript, when the user submits a form or
clicks a link and starts a transition to another route, the best the browser can
do for pending UI is to update the favicon to a spinner. We can do better with
JavaScript. We can put the loading indicator closer to where the user's
attention is already at the start of the transition:

```tsx app/routes/dogo/new.tsx
import { useTransition } from "@remix-run/react";

export default function NewDogoRoute() {
  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);
  return (
    <Form method="post">
      <label>
        Name: <input name="dogo-name" />
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating Dogo..." : "Create Dogo"}
      </button>
    </Form>
  );
}
```

In this example we're simply asking Remix about the current transition. If
there's a `submission` on it then we know that the user has submitted a form and
we can display `Creating Dogo...` in the submit button and disable it. You could
also render a loading spinner or whatever else you'd like based on that
information. If the request errors, then the submission goes away and we
re-render with `isSubmitting` as `false` so the user can try again.

Another cool thing we can do with JavaScript is pre-fetch data/code/other assets
so it's ready when the user actually navigates to different routes. One
challenge relatively unique to the web is that we don't download the entire
application upfront. Instead we split the application code into chunks resulting
in a much faster initial load.

However, we also like to co-locate our data requirements with the code that
requires it (makes it much easier to maintain long-term). Traditionally this has
meant that we have to download the code first, and then the code will execute to
download the data. That's a waterfall effect which results in a slower
application.

Remix changes this because with the structure of a Remix app, we're able to know
code and data requirements just by looking at the URL. Remix doesn't have to
execute any of your code to know which bit of it is needed. This makes it
trivial to pre-fetch code and data as the user is using the site. Seriously,
this is all you need to do:

```diff
- <Link to={dogo.id}>{dogo.name}</Link>
+ <Link to={dogo.id} prefetch="intent">{dogo.name}</Link>
```

With that, Remix will automatically prefetch code, data, and other needed assets
as soon as the user hovers or focuses the link. This sometimes makes the app
feel instant. Like it was all downloaded from the start!

There are lots of other cool things we can do to enhance the user's experience
with JavaScript. For a long time the status quo has been that JavaScript enables
the experience. The cool thing about Remix is that the baseline is a functional
app experience and we simply enhance the experience with JavaScript. There are
two cool things about this:

1. The basic functions of the app work _before_ the JS has started loading.
2. It's evidence that you don't need to think about application state
   management. 🤯

That's enough for now...

P.S. Make sure you add the `<Scripts />` back before doing the exercise because
we kinda need JavaScript for this improved UX 😅

## 💪 Exercise

Let's start by adding a loading state to the create button in our form. Once the
user submits the form, the button should change to "Creating..." and we should
disable the button.

## 🗃 Files

- `app/routes/posts/admin/new.tsx`

## 💯 Extra Credit

### 1. Prefetch Posts

When users are reading our blog posts, we want them to load as quickly as
possible. Let's add a `prefetch` to the links on our post listing page
(`app/routes/posts/index.js`) and we may as well do the same thing for our admin
page as well (`app/routes/posts/admin.tsx`).

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Remix%20Fundamentals&e=06.%20Progressive%20Enhancement&em=
