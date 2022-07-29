# 04. Nested Routing

## 📝 Notes

## 🤓 Background

Most web applications have multiple route "segments". You might think of a URL
as something similar to a filepath on a filesystem:

```sh
# filesystem
/Users/yourname/photos/mountains/timpanogos.jpg
# URL
https://yourname-photos.com/mountains/timpanogos
```

And just like a filesystem where files are contained within folders which are
contained within folders, UIs often resemble this same relationship. For a
deeper look at this idea, checkout 📜
[What is nested Routing](https://remix.run/docs/en/v1/guides/routing#what-is-nested-routing)
in the Remix documentation.

What makes nested layout routes so great is that it allows you to de-couple the
parent routes from their children. This means that teams can work independently
and Remix will stitch the application together at runtime. The team in charge of
the header/footer can work without worrying about the data the various other
product teams need, and those teams don't need to worry about what the
header/footer team needs either. This eliminates one of the major challenges
that lead organizations to desire a complicated micro-frontend architecture.

## 💪 Exercise

It's about time we start writing blog posts! Let's add a route to `/posts/admin`
where we can see a list of our posts and edit them at `/posts/admin/:slug` and
create new ones at `/posts/admin/new`.

For this exercise, all you're expected to do is create the files and export the
components. We'll get to implementing the features in the next exercise once we
have the routes all configured.

🦉 TIP! At any time, you can `cd` into the project directory and run
`npx remix routes` and Remix will print out the route configuration that will be
generated based on your filesystem. For example, before this exercise your route
configuration will look something like this:

```jsx
<Routes>
  <Route file="root.tsx">
    <Route path="posts/:slug" file="routes/posts/$slug.tsx" />
    <Route path="posts" index file="routes/posts/index.tsx" />
    <Route path="logout" file="routes/logout.tsx" />
    <Route index file="routes/index.tsx" />
    <Route path="login" file="routes/login.tsx" />
  </Route>
</Routes>
```

After you're finished, it should look something like this:

```jsx
<Routes>
  <Route file="root.tsx">
    <Route path="posts/:slug" file="routes/posts/$slug.tsx" />
    <Route path="posts/admin" file="routes/posts/admin.tsx">
      <Route index file="routes/posts/admin/index.tsx" />
      <Route path="new" file="routes/posts/admin/new.tsx" />
    </Route>
    <Route path="posts" index file="routes/posts/index.tsx" />
    <Route path="logout" file="routes/logout.tsx" />
    <Route index file="routes/index.tsx" />
    <Route path="login" file="routes/login.tsx" />
  </Route>
</Routes>
```

## 🗃 Files

- `app/routes/posts/index.tsx`
- `app/routes/posts/admin.tsx` <-- new file
- `app/routes/posts/admin/new.tsx` <-- new file
- `app/routes/posts/admin/index.tsx` <-- new file

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Remix%20Fundamentals&e=04.%20Nested%20Routing&em=
