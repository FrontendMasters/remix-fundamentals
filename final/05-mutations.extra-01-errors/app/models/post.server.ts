import { prisma } from "~/db.server";

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

// We'll improve this in the extra credit
export async function createPost(post: any) {
  return prisma.post.create({ data: post });
}
