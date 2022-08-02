import { prisma } from "~/db.server";

export async function getPostListItems() {
  return prisma.post.findMany({ select: { slug: true, title: true } });
}
