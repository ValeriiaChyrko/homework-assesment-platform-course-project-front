import {auth, currentUser} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string; } }
) {
    try {
        const user = await currentUser();
        const { courseId } = await params;

        if (!user && !user!.id && !user!.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true,
            }
        });

        const existingEnrollment = await db.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: user!.id,
                    courseId: courseId
                }
            }
        });

        if (existingEnrollment) {
            return new NextResponse("Already Enrolled", { status:400 });
        }

        if (!course) {
            return new NextResponse("Not Found", { status: 404 } )
        }

        const enrollment = await db.enrollment.create({
            data: {
                courseId: courseId,
                userId: user!.id,
            }
        });

        return NextResponse.json(enrollment);
    } catch (e) {
        console.error("[COURSES_ID_ENROLL]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}