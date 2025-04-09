import prisma from "@/lib/db"
// export const dynamic = "force-static"


async function Data() {
    const data = await prisma.details.findMany()
    console.log(data)
    return (
        data.map((item) => (
            <div key={item.id}>
                <h1>{item.temp}</h1>
                <p>{item.volt}</p>
                <p>{item.date.toString()}</p>
            </div>
        ))
    )
}

export default Data