import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; } }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        });

        if (!course) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const unpublishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                isPublished: false
            }
        })

        return NextResponse.json(unpublishedCourse);
    } catch (e) {
        console.error("[COURSE_ID_UNPUBLISH]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}