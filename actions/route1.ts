"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export async function createRecord() {
    try{
      const response = await prisma.details.create({
        data: {
            temp : "28",
            volt : 5,
            date : new Date(),
        }
      })
      console.log("New record created: " + JSON.stringify(response))
      return { success: true, data: response }
    }
    catch (e){
        console.log("Error in Prisma : " + JSON.stringify(e));
        return { success: false, error: e }
    }
}


export async function getRecords() {
    try{
        const data = await prisma.details.findMany(
            {
                orderBy: {
                    date: 'desc'
                },
                take : 10,
            }
        )
         console.log("Fetched records: " + JSON.stringify(data));
        return data
    }
    catch(e){
        console.log("Error in fetching records: " , e);
        return null
    }
}



