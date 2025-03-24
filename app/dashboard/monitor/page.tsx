import * as React from "react"
import mqtt from "mqtt";

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link"




export default function page() {
    return (
        <div className="flex h-full">
            <div className="flex  justify-center items-center w-[80vw] ">




                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Select Machine</CardTitle>
                        <CardDescription>Select a machine to monitor</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="framework">Device Name</Label>
                                    <Select>
                                        <SelectTrigger id="framework">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="next">Device 1</SelectItem>
                                            <SelectItem value="sveltekit">Device 2</SelectItem>
                                            <SelectItem value="astro">Device 3</SelectItem>

                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Link href="/dashboard/monitor/device">
                            <Button>Submit</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
