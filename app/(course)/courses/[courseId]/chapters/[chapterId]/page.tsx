import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {getChapter} from "@/actions/get-chapter";
import {Banner} from "@/components/banner";
import {VideoPlayer} from "./_components/video-player";
import {CourseEnrollButton} from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-enroll-button";
import Image from "next/image";
import OppsPageImageSrc from "@/public/opps-page.svg";
import {Separator} from "@/components/ui/separator";
import {Preview} from "@/components/preview";
import {File} from "lucide-react"
import { CourseProgressButton } from "./_components/course-progress-button";

const ChapterIdPage = async ({
    params
}: {
    params: {courseId: string; chapterId: string}
}) => {
    const {userId} = await auth();
    const {courseId, chapterId} = await params;

    if (!userId) {
        return redirect("/");
    }

    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        enrollment
    } = await getChapter({
        userId,
        chapterId: chapterId,
        courseId: courseId,
    });

    if (!course || !chapter) {
        return redirect("/");
    }

    const isLocked = !chapter.isFree;
    const completeOnEnd = !userProgress?.isCompleted;
    const hasAttachedVideo = muxData?.playbackId !== undefined;

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner
                    variant="success"
                    label="Ви вже виконали всі завдання цього розділу."
                />
            )}
            {isLocked && (
                <>
                    <Banner
                        variant="warning"
                        label="Доступ до цього розділу обмежено."
                    />
                    <div className="md:pl-30 pt-[80px] flex flex-col items-center justify-center text-center">
                        <Image
                            src={OppsPageImageSrc}
                            alt="Відео недоступне"
                            width={400}
                            height={300}
                            className="max-w-full h-auto self-center"
                        />
                        <div className="text-center mt-10">
                            <h1 className="text-2xl font-bold uppercase">Цей розділ наразі недоступний.</h1>
                            <p className="mt-2 text-md text-muted-foreground">
                                Доступ може бути відкритий викладачем пізніше. Зверніться до викладача для деталей.
                            </p>
                        </div>
                    </div>
                </>
            )}
            {!isLocked && (
                <div className="flex flex-col max-w-4xl mx-auto pb-20">
                    <div className="p-4">
                        {hasAttachedVideo && (
                            <VideoPlayer
                                title={chapter.title}
                                courseId={courseId}
                                chapterId={chapterId}
                                nextChapterId={nextChapter?.id}
                                playbackId={muxData?.playbackId!}
                                completeOnEnd={completeOnEnd}
                            />
                        )}
                    </div>
                    <div>
                        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                            <h2 className="text-2xl font-semibold mb-2">
                                {chapter.title}
                            </h2>
                            {enrollment  ? (
                                <CourseProgressButton
                                    chapterId={chapterId}
                                    courseId={courseId}
                                    nextChapterId={nextChapter?.id}
                                    isCompleted={!!userProgress?.isCompleted}
                                />
                            ) : (
                                <CourseEnrollButton
                                    courseId={courseId}
                                />
                            )}
                        </div>
                        <Separator />
                        <div className="p-4">
                            <Preview value={chapter.description!}/>
                        </div>
                        {!!attachments.length && (
                            <>
                                <Separator />
                                <div className="px-4 pt-2 space-y-2 mt-4">
                                    {attachments.map((attachment) => (
                                        <a
                                            href={attachment.url}
                                            target="_blank"
                                            key={attachment.id}
                                            className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                        >
                                            <File className="h-4 w-4 mr-2 flx-shrink-0"/>
                                            <p className="text-xs line-clamp-1">
                                                {attachment.name}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChapterIdPage;