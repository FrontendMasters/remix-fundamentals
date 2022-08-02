import { prisma } from "~/db.server";

import type { Post } from "@prisma/client";

export async function getPostListItems() {
  return prisma.post.findMany({ select: { slug: true, title: true } });
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(
  post: Pick<Post, "slug" | "title" | "markdown">,
) {
  return prisma.post.create({ data: post });
}

export async function deletePost(slug: string) {
  return prisma.post.delete({ where: { slug } });
}

export async function updatePost(
  post: Pick<Post, "slug" | "title" | "markdown">,
) {
  return prisma.post.update({ data: post, where: { slug: post.slug } });
}
