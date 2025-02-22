"use client"

import * as z from "zod";
import axios from "axios";

import {Button} from "@/components/ui/button";
import {PencilIcon, PlusCircle, Video} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {Chapter, MuxData} from "@prisma/client";
import MaxPlayer from "@mux/mux-player-react";
import {FileUpload} from "@/components/file-upload";

interface ChapterFormProps {
    initialData: Chapter & {muxData?: MuxData | null};
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    videoUrl: z.string().min(1)
});

const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterFormProps) => {

    const [isEditing, setEditing] = useState(false);

    const toggleEditing = () => setEditing((current) => !current);
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
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
                Відеофайл курсу
                <Button onClick={toggleEditing} variant="ghost">
                    {isEditing && (
                        <>Скасувати</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-1"/>
                            Прикріпити відео
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <PencilIcon className="h-4 w-4 mr-1"/>
                            Змінити відео
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-4">
                        <Video className="h-10 w-10 text-slate-500"/>
                    </div>
                ) : (
                    <div className="relative aspect-video mt-4">
                        <MaxPlayer
                            playbackId={initialData?.muxData?.playbackId || ""}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChangeAction={(url?: string) => {
                            if (url) {
                                onSubmit({ videoUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Прикріпіть відео до цього розділу, щоб надати додаткову інформацію та візуальні матеріали.
                    </div>
                </div>
            )}
            {!isEditing && initialData.videoUrl && (
                <div className="text-xs text-muted-foreground mt-4">
                    Обробка відео може тривати кілька хвилин. Якщо відео не відображається, будь ласка, оновіть сторінку.
                </div>
            )}
        </div>
    )
}

export default ChapterVideoForm;