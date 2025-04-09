import prisma from "@/lib/db"
import { revalidatePath } from "next/cache";

async function page() {
    "use cache"

    async function appenddata() {
        "use server";
        await prisma.details.create({
            data: {
                temp: 10.8.toString(),
                volt: 20,
                date: new Date().toISOString(),
            }
        })
        revalidatePath("/something");
    }


    const data = await prisma.details.findMany();
    console.log(data)

    return (<>
        <div>hi</div>
        {data.map((item) => (
            <div key={item.id}>{item.temp}</div>
        ))}
        <div>somethingrendering here</div>
        <div>hey there</div>


        <form action={appenddata}>

            <button type="submit">Submit</button>
        </form>

    </>
    )
}

export default page