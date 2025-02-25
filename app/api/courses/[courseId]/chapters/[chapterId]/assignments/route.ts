import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {isTeacher} from "@/lib/teacher";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } },
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId } = await params;
        const { title } = await req.json();

        if (!userId || !isTeacher(userId)) {
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

        const lastAssignment = await db.assignment.findFirst({
            where: {
                chapterId: chapterId,
            },
            orderBy: {
                position: "desc",
            }
        });

        const newPosition = lastAssignment ? lastAssignment.position + 1 : 1;

        const assignment = await db.assignment.create({
            data: {
                title,
                chapterId: chapterId,
                position: newPosition,
            }
        })

        return NextResponse.json(assignment);
    } catch (e) {
        console.error("[ASSIGNMENTS]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}