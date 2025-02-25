import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; assignmentId: string; } }
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId, assignmentId } = await params;

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

        if (!chapter) {
            return new NextResponse("Not Found", { status: 404 })
        }

        const assignment = await db.assignment.findUnique({
            where: {
                id: assignmentId,
                chapterId: chapterId,
            }
        });

        if (!assignment || !assignment.title || !assignment.description || !assignment.repositoryUrl) {
            return new NextResponse("Missing required parameters", { status: 400 });
        }

        const publishedAssignments = await db.assignment.update({
            where: {
                id: assignmentId,
                chapterId: chapterId,
            },
            data: {
                isPublished: true,
            }
        })

        return NextResponse.json(publishedAssignments);
    } catch (e) {
        console.error("[CHAPTER_ASSIGNMENT_PUBLISH]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}