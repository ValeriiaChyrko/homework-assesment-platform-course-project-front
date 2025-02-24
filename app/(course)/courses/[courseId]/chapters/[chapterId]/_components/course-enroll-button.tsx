"use client"

import {Button} from "@/components/ui/button";
import {useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import axios from "axios";

interface CourseEnrollButtonProps {
    courseId: string;
}

export const CourseEnrollButton = ({
    courseId
}: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.post(`/api/courses/${courseId}/enroll`);
            toast.success("Ви успішно зареєструвались на курс.");
            router.refresh();
        } catch (e) {
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            size="sm"
            className="w-full md:w-auto"
        >
            Зареєструватися
        </Button>
    )
}