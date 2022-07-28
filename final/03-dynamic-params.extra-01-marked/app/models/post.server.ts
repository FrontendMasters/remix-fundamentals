import { prisma } from "~/db.server";

export async function getPosts() {
  return prisma.post.findMany();
}

// @ts-expect-error we'll fix this in extra credit
export async function getPost(slug) {
  return prisma.post.findUnique({ where: { slug } });
}
