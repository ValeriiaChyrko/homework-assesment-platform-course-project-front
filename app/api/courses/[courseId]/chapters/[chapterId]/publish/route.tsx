import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId } = await params;

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
                courseId: courseId,
            }
        });

        if (!chapter || !chapter.title || !chapter.description) {
            return new NextResponse("Missing required parameters", { status: 400 });
        }

        const publishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId,
            },
            data: {
                isPublished: true,
            }
        })

        return NextResponse.json(publishedChapter);
    } catch (e) {
        console.error("[COURSES_CHAPTER_PUBLISH]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}