import {db} from "@/lib/db";
import {Attachment, Chapter, Enrollment} from "@prisma/client";

interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
}

export const getChapter = async  ({
    userId,
    courseId,
    chapterId,
}: GetChapterProps) => {
    try {
        const enrollment = await db.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: userId,
                    courseId: courseId
                }
            }
        });

        const course = await db.course.findUnique({
            where: {
                isPublished:true,
                id: courseId,
            }
        })

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished:true,
            }
        })

        if (!chapter) {
            throw new Error(`Chapter not found: ${chapterId}`);
        }
        if (!course) {
            throw new Error(`Chapter not found: ${courseId}`);
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        if (enrollment) {
            attachments = await db.attachment.findMany({
                where: {
                    courseId: courseId,
                }
            });
        }

        if (chapter.isFree || enrollment) {
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId: chapterId,
                }
            });

            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position,
                    }
                },
                orderBy: {
                    position: "asc"
                }
            });
        }

        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }
        });

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            enrollment
        };

    } catch (e) {
        console.error(e);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            enrollment: null,
        }
    }
}