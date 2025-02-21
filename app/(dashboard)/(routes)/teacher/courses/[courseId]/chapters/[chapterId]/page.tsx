import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import Link from "next/link";
import {ArrowLeft, LayoutDashboard} from "lucide-react";
import {IconBadge} from "@/components/icon-badge";
import ChapterTitleForm
    from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-title-form";
import ChapterDescriptionForm
    from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-description-form";

const ChapterIdPage = async ({
    params
}: {
    params: { courseId: string; chapterId: string }
}) => {
    const {userId} = await auth();
    const {courseId, chapterId} = await params;

    if(!userId) {
        return redirect(`/`);
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: chapterId,
            courseId: courseId
        },
        include: {
            muxData: true,
        }
    });

    if (!chapter) {
        return redirect("/");
    }

    const requiredFields = [
        chapter.title,
        chapter.description
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/teacher/courses/${courseId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Повернутись до налаштувань курсу
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Налаштування розділу курсу
                            </h1>
                            <span className="text-sm text-slate-700">
                                Завершіть заповнення всіх полів {completionText}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Персоналізуйте свій розділ
                            </h2>
                        </div>
                        <ChapterTitleForm
                            initialData={chapter}
                            courseId={courseId}
                            chapterId={chapterId}
                        />
                        <ChapterDescriptionForm
                            initialData={chapter}
                            courseId={courseId}
                            chapterId={chapterId}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChapterIdPage;