import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;
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

        for (let item of list) {
            await db.chapter.update({
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