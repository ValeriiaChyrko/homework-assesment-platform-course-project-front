﻿import {auth} from "@clerk/nextjs/server";
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
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });

        if (!course) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const hasPublishedChapter = course.chapters.some((chapter)=> chapter.isPublished);

        if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter) {
            return new NextResponse("Missing required parameters", { status: 404 });
        }

        const publishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                isPublished: true
            }
        })

        return NextResponse.json(publishedCourse);
    } catch (e) {
        console.error("[COURSE_ID_PUBLISH]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}