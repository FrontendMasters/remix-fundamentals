import { prisma } from "~/db.server";

export async function getPosts() {
  return prisma.post.findMany();
}

// 🐨 create a new function here called "getPost"
// that takes a slug and returns a post
// 💰 use the prisma.post.findUnique function
// with the "where" option set to { slug }
