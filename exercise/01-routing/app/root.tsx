import { LiveReload } from "remix";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Remix: So great, it's funny!</title>
      </head>
      <body>
        {process.env.NODE_ENV === "development" ? (
          <LiveReload port={require("../remix.config").devServerPort} />
        ) : null}
      </body>
    </html>
  );
}
