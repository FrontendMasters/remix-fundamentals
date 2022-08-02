import { Link } from "@remix-run/react";

// 🐨 add a loader here so we can get the request
// 🐨 call requireAdminUser from session.server with the request
// 💰 return json({}) (you must return a response)

export default function AdminIndex() {
  return (
    <p>
      <Link to="new" className="text-blue-600 underline">
        Create a New Post
      </Link>
    </p>
  );
}
