"use client"

import * as z from "zod";
import axios from "axios";

import {Button} from "@/components/ui/button";
import {ImageIcon, PencilIcon, PlusCircle} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {Course} from "@prisma/client";
import Image from "next/image"
import {FileUpload} from "@/components/file-upload";

interface ImageFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Необхідно прикріпити зображення.",
    }),
});

const ImageForm = ({
    initialData,
    courseId
}: ImageFormProps) => {

    const [isEditing, setEditing] = useState(false);

    const toggleEditing = () => setEditing((current) => !current);
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.patch(`/api/courses/${courseId}`, values);
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
                Обкладинка курсу
                <Button onClick={toggleEditing} variant="ghost">
                    {isEditing && (
                        <>Скасувати</>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-1"/>
                            Прикріпити забраження
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <PencilIcon className="h-4 w-4 mr-1"/>
                            Змінити забраження
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-4">
                        <ImageIcon className="h-10 w-10 text-slate-500"/>
                    </div>
                ) : (
                    <div className="relative aspect-video mt-4">
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageUrl}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseImage"
                        onChangeAction={(url?: string) => {
                            if (url) {
                                onSubmit({ imageUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Рекомендується співвідношення сторін 16:9
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImageForm;