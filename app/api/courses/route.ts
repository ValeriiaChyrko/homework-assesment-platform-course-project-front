import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {db} from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.create({
            data: {
                userId,
                title,
            }
        });

        return NextResponse.json(course);
    } catch (e) {
        console.error("[COURSES]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}