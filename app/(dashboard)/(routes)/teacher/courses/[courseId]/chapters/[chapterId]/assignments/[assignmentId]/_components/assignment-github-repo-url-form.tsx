"use client"

import * as z from "zod";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {PencilIcon} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {Assignment} from "@prisma/client";
import {cn} from "@/lib/utils";

interface AssignmentGitHubRepoTitleFormProps {
    initialData: Assignment;
    courseId: string;
    chapterId: string;
    assignmentId: string;
}

const formSchema = z.object({
    repositoryUrl: z.string().min(1, {
        message: "Необхідно вказати URL.",
    }),
});

export const AssignmentGithubRepoUrlForm = ({
    initialData,
    courseId,
    chapterId,
    assignmentId,
}: AssignmentGitHubRepoTitleFormProps) => {
    const [isEditing, setEditing] = useState(false);

    const toggleEditing = () => setEditing((current) => !current);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            repositoryUrl: initialData.repositoryUrl || '',
        }
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}`, values);
            toast.success("Дані оновлено успішно.");
            toggleEditing();
            router.refresh();
        } catch (e) {
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
            console.error(e);
        }
    }

    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                URL репозиторію (GitHub HTTPS)
                <Button onClick={toggleEditing} variant="ghost">
                    {isEditing ? (
                        <>Скасувати</>
                    ) : (
                        <>
                            <PencilIcon className="h-4 w-4 mr-1"/>
                            Змінити URL
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn("text-sm mt-2", {
                    "text-slate-500 italic": !initialData.repositoryUrl,
                    "text-slate-700": initialData.repositoryUrl
                })}>
                    {!initialData.repositoryUrl ? (
                        <span className="text-slate-500 italic">URL не вказано</span>
                    ) : (
                        <span>{initialData.repositoryUrl}</span>
                    )}
                    <div className="mt-1">
                        <span>Власник: </span>
                        {initialData.repositoryOwner ? (
                            <span className="font-semibold">{initialData.repositoryOwner}</span>
                        ) : (
                            <span className="text-slate-500 italic">Власника не вказано</span>
                        )}
                    </div>
                    <div className="mt-1">
                        <span>Назва: </span>
                        {initialData.repositoryName ? (
                            <span className="font-semibold">{initialData.repositoryName}</span>
                        ) : (
                            <span className="text-slate-500 italic">Назву не вказано</span>
                        )}
                    </div>
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="repositoryUrl"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Наприклад, 'https://github.com/<owner>/<repository>.git'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Зберегти зміни
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default AssignmentGithubRepoUrlForm;