"use client"

import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import {ConfirmDialog} from "@/components/models/confirm-modal";
import {useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useConfettiStore} from "@/hooks/use-confetti-store";

interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

export const Actions = ({
    disabled,
    courseId,
    isPublished,
}: ActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Курс знято з публікації.");
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Курс опубліковано.");
                confetti.onOpen();
            }

            router.refresh();
        } catch (e) {
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/courses/${courseId}`);

            toast.success("Дані видалено успішно.");
            router.refresh();
            router.push(`/teacher/courses`);
        } catch (e) {
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Зняти з публікації" : "Опублікувати"}
            </Button>
            <ConfirmDialog
                onConfirm={onDelete}
            >
                <Button
                    disabled={isLoading}
                    size="sm"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </ConfirmDialog>
        </div>
    )
}