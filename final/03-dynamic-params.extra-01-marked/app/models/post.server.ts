import { prisma } from "~/db.server";

export async function getPostListItems() {
  return prisma.post.findMany({ select: { slug: true, title: true } });
}

// @ts-expect-error we'll fix this in extra credit
export async function getPost(slug) {
  return prisma.post.findUnique({ where: { slug } });
}
