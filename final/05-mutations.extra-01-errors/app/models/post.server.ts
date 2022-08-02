import { prisma } from "~/db.server";

export async function getPostListItems() {
  return prisma.post.findMany({ select: { slug: true, title: true } });
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

// We'll improve this in the extra credit
export async function createPost(post: any) {
  return prisma.post.create({ data: post });
}
