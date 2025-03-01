﻿"use client"

import {Button} from "@/components/ui/button";
import {CheckCircle, XCircle} from "lucide-react";
import {useRouter} from "next/navigation";
import {useConfettiStore} from "@/hooks/use-confetti-store";
import {useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";

interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    isCompleted?: boolean;
    nextChapterId?: string;
}

export const CourseProgressButton = ({
    chapterId,
    courseId,
    isCompleted,
    nextChapterId,
}: CourseProgressButtonProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();
    const[isLoading, setIsLoading] = useState<boolean>(false);

    const onClick = async () => {
      try {
          setIsLoading(true);

          await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
              isCompleted: !isCompleted,
          });

          if (!isCompleted && !nextChapterId) {
              confetti.onOpen();
          }

          if (!isCompleted && nextChapterId) {
              router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
          }

          toast.success("Прогрес оновлено успішно.");
          router.refresh();
      } catch (e) {
          toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
          console.error(e);
      } finally {
          setIsLoading(false);
      }
    }

    const Icon = isCompleted ? XCircle : CheckCircle;

    return (
        <Button
            type="button"
            onClick={onClick}
            disabled={isLoading}
            variant={isCompleted ? "outline" : "success"}
            className="w-full md:w-auto"
        >
            {isCompleted ? "Не завершено" : "Позначити як завершений"}
            <Icon
                className="h-4 w-4 ml-2"
            />
        </Button>
    )
}