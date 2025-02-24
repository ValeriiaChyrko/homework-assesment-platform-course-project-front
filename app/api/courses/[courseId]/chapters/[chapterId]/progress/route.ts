import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function PUT(
    req: Request,
    { params }: { params: { chapterId: string } }
) {
    try {
        const { userId } = await auth();
        const { chapterId } = await params;
        const {isCompleted} = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: chapterId
                }
            },
            update: {
                isCompleted
            },
            create: {
                userId,
                chapterId,
                isCompleted
            }
        });

        return NextResponse.json(userProgress);
    } catch (e) {
        console.error("[COURSES_CHAPTER_ID_PUBLISH]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}