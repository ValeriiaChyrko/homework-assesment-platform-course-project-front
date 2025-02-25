import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } }
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId } = await params;
        const { list } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId
            }
        });

        if (!chapter) {
            return new NextResponse("Not Found", { status: 404 });
        }

        for (let item of list) {
            await db.assignment.update({
                where: {id: item.id},
                data: {position: item.position}
            });
        }

        return new NextResponse("OK", { status: 200 });
    } catch (e) {
        console.error("[REORDER]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}