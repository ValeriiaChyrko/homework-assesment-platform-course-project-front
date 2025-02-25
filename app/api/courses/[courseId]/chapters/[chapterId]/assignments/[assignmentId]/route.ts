import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import {isTeacher} from "@/lib/teacher";


export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; assignmentId: string } }
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId, assignmentId } = await params;

        if (!userId || !isTeacher(userId)) {
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

        const assignment = await db.assignment.findUnique({
            where: {
                id: assignmentId,
                chapterId: chapterId,
            }
        });

        if (!assignment) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const deletedAssignment = await db.assignment.delete({
            where: {
                id: assignmentId,
            }
        });

        const publishedAssignmentsInChapter = await db.assignment.findMany({
            where: {
                chapterId: chapterId,
                isPublished: true
            }
        });

        if (!publishedAssignmentsInChapter.length) {
            await db.chapter.update({
                where: {
                    id: chapterId,
                },
                data: {
                    isPublished: false,
                }
            });
        }

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true
            }
        });

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: courseId,
                },
                data: {
                    isPublished: false,
                }
            });
        }

        return NextResponse.json(deletedAssignment);
    } catch (e) {
        console.error("[CHAPTERS_ASSIGNMENT_ID_DELETE]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; assignmentId: string } }
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId, assignmentId } = await params;
        const { repositoryUrl, isPublished, ...values } = await req.json();

        if (!userId) {
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

        const extractRepoData = (url: string) => {
            if (url) {
                const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\.git)?/;
                const match = url.match(regex);
                if (match) {
                    return {
                        repositoryOwner: match[1],
                        repositoryName: match[2].replace(/\.git$/, ''),
                    };
                }
            }

            return { repositoryOwner: '', repositoryName: '' };
        };

        const { repositoryOwner, repositoryName } = extractRepoData(repositoryUrl);

        const updateData: any = {
            ...values
        };

        if (repositoryUrl) {
            updateData.repositoryUrl = repositoryUrl;
        }
        if (repositoryOwner) {
            updateData.repositoryOwner = repositoryOwner;
        }
        if (repositoryName) {
            updateData.repositoryName = repositoryName;
        }

        const assignment = await db.assignment.update({
            where: {
                id: assignmentId,
                chapterId: chapterId,
            },
            data: updateData
        });

        return NextResponse.json(assignment);
    } catch (e) {
        console.error("[CHAPTER_ASSIGNMENT_ID]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}