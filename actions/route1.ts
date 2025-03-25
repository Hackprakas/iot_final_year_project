"use server";

import prisma from "@/lib/db";

// const prisma = new PrismaClient();

export async function createRecord(data: {
  temp: string;
  volt: number;
  date: Date;
}) {
  try {
    const response = await prisma.details.create({
      data: {
        temp: data.temp,
        volt: data.volt,
        date: new Date(),
      },
    });
    console.log("New record created: " + JSON.stringify(response));
    return { success: true, data: response };
  } catch (e) {
    console.log("Error in Prisma : " + JSON.stringify(e));
    return { success: false, error: e };
  }
}

export async function getRecords() {
  try {
    const data = await prisma.details.findMany({
      orderBy: {
        date: "desc",
      },
      take: 10,
    });
    console.log("Fetched records: " + JSON.stringify(data));
    return data;
  } catch (e) {
    console.log("Error in fetching records: ", e);
    return null;
  }
}
