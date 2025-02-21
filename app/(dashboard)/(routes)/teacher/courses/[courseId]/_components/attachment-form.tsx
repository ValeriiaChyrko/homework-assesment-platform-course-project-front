"use client"

import * as z from "zod";
import axios from "axios";

import {Button} from "@/components/ui/button";
import {File, Loader2, PlusCircle, X} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {Attachment, Course} from "@prisma/client";
import {FileUpload} from "@/components/file-upload";

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
}

const formSchema = z.object({
    url: z.string().min(1)
});

const AttachmentForm = ({
    initialData,
    courseId
}: AttachmentFormProps) => {

    const [isEditing, setEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleEditing = () => setEditing((current) => !current);
    const router = useRouter();

    const onSubmit = async (values: { url: string; name: string }) => {
        try{
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Дані оновлено успішно.");
            toggleEditing();
            router.refresh();
        } catch (e) {
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
            console.error(e);
        }
    }

    const onDelete = async (id: string) => {
        try{
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Файл видалено успішно.");
            router.refresh();
        } catch (e) {
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
            console.error(e);
        } finally {
            setDeletingId(null);
        }
    }

    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Матеріали курсу
                <Button onClick={toggleEditing} variant="ghost">
                    {isEditing && (
                        <>Скасувати</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-1"/>
                            Прикріпити файл
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="test-sm mt-2 text-slate-500 italic">
                            Ще не додано жодних файлів
                        </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2 mt-4">
                            {initialData.attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                >
                                    <File className="h-4 w-4 mr-2 flx-shrink-0"/>
                                    <p className="text-xs line-clamp-1">
                                        {attachment.name}
                                    </p>
                                    {deletingId === attachment.id && (
                                        <div className="flex-shrink-0 ml-4">
                                            <Loader2 className="h-4 w-4 animate-spin"/>
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <button
                                            onClick={() => onDelete(attachment.id)}
                                            className="ml-auto hover:opacity-75 transition"
                                        >
                                            <X className="h-4 w-4"/>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseAttachment"
                        onChangeAction={(url?: string, name?: string) => {
                            if (url && name) {
                                onSubmit({ url: url, name: name });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Додайте матеріали, які можуть знадобитися вашим студентам для проходження курсу.
                    </div>
                </div>
            )}
        </div>
    )
}

export default AttachmentForm;