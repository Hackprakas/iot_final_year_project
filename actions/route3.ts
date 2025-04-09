"use server";

import prisma from "@/lib/db";

export async function getData() {
  const data = await prisma.details.findMany();
  return data;
}
