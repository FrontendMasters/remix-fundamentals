import invariant from "tiny-invariant";

export function getEnv() {
  invariant(process.env.ADMIN_EMAIL, "process.env.ADMIN_EMAIL not defined");

  return {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  };
}

type ENV = ReturnType<typeof getEnv>;

// App puts these on
declare global {
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
