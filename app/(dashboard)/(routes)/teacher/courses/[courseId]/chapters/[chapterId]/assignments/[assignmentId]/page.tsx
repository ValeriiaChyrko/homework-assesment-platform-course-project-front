import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import Link from "next/link";
import {
    ArrowLeft, CalendarClock,
    Github,
    LayoutDashboard,
    Presentation
} from "lucide-react";
import {Banner} from "@/components/banner";
import {IconBadge} from "@/components/icon-badge";
import AssignmentTitleForm from "./_components/assignment-title-form";
import AssignmentDescriptionForm from "./_components/assignment-description-form";
import AssignmentGithubRepoUrlForm from "./_components/assignment-github-repo-url-form";
import AssignmentDeadlineForm
    from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/assignments/[assignmentId]/_components/assignment-deadline-form";
import AssignmentTestCriteriaForm from "./_components/assignment-test-criteria-form";
import {
    AssignmentActions
} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/assignments/[assignmentId]/_components/assignment-actions";

const AssignmentIdPage = async ({
params
}: {
    params: { courseId: string; chapterId: string; assignmentId: string }
}) => {
    const {userId} = await auth();
    const {courseId, chapterId, assignmentId} = await params;

    if(!userId) {
        return redirect(`/`);
    }

    const assignment = await db.assignment.findUnique({
        where: {
            id: assignmentId,
            chapterId: chapterId
        }
    });

    if (!assignment) {
        return redirect("/");
    }

    const requiredFields = [
        assignment.title,
        assignment.description,
        assignment.repositoryName,
        assignment.repositoryOwner,
        assignment.deadline,
        assignment.maxScore,
        assignment.maxAttemptsAmount
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!assignment.isPublished && (
                <Banner
                    variant="warning"
                    label="Цей завдання ще не опубліковано. Воно не буде відображатися в розділі."
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/teacher/courses/${courseId}/chapters/${chapterId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Повернутись до налаштувань розділу
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Налаштування завдання розділу
                                </h1>
                                <span className="text-sm text-slate-700">
                                    Завершіть заповнення всіх полів {completionText}
                                </span>
                            </div>
                            <AssignmentActions
                                disabled={!isComplete}
                                courseId={courseId}
                                chapterId={chapterId}
                                assignmentId={assignmentId}
                                isPublished={assignment.isPublished}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Персоналізуйте своє завдання
                                </h2>
                            </div>
                            <AssignmentTitleForm
                                initialData={assignment}
                                courseId={courseId}
                                chapterId={chapterId}
                                assignmentId={assignmentId}
                            />
                            <AssignmentDescriptionForm
                                initialData={assignment}
                                courseId={courseId}
                                chapterId={chapterId}
                                assignmentId={assignmentId}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Github} />
                                <h2 className="text-xl">
                                    Налаштування GitHub
                                </h2>
                            </div>
                            <AssignmentGithubRepoUrlForm
                                initialData={assignment}
                                courseId={courseId}
                                chapterId={chapterId}
                                assignmentId={assignmentId}
                            />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={CalendarClock} />
                                <h2 className="text-xl">
                                    Термін здачі
                                </h2>
                            </div>
                            <AssignmentDeadlineForm
                                initialData={assignment}
                                courseId={courseId}
                                chapterId={chapterId}
                                assignmentId={assignmentId}
                            />
                        </div>
                        <div>
                            <div>
                                <div className="flex items-center gap-x-2">
                                    <IconBadge icon={Presentation} />
                                    <h2 className="text-xl">
                                        Управління балами та спробами
                                    </h2>
                                </div>
                                <AssignmentTestCriteriaForm
                                    initialData={assignment}
                                    courseId={courseId}
                                    chapterId={chapterId}
                                    assignmentId={assignmentId}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AssignmentIdPage;