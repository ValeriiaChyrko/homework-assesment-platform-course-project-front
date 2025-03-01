﻿import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {isTeacher} from "@/lib/teacher";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string, attachmentId: string } }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;
        const { attachmentId } = await params;

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

        const attachment = await db.attachment.delete({
            where: {
                courseId: courseId,
                id: attachmentId
            }
        })

        return NextResponse.json(attachment);
    } catch (e) {
        console.error("[ATTACHMENT_ID]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}