import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {isTeacher} from "@/lib/teacher";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;
        const { url, name } = await req.json();

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

        if (!name) {
            return new NextResponse("File name is required", { status: 503 });
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                name: name,
                courseId: courseId
            }
        })

        return NextResponse.json(attachment);
    } catch (e) {
        console.error("[COURSE_ID_ATTACHMENTS]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}