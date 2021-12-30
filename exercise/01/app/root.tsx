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
          <LiveReload port={Number(process.env.DEV_SERVER_PORT ?? 8002)} />
        ) : null}
      </body>
    </html>
  );
}
