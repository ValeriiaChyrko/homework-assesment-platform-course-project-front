"use client";

import * as React from "react";
import { uk } from "date-fns/locale";
import { format } from "date-fns";
import { CalendarIcon, PencilIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {Assignment} from "@prisma/client";

interface AssignmentDeadlineFormProps {
    initialData: Assignment;
    courseId: string;
    chapterId: string;
    assignmentId: string;
}

const formSchema = z.object({
    deadline: z.date().optional(),
});

export const AssignmentDeadlineForm = ({
                                           initialData,
                                           courseId,
                                           chapterId,
                                           assignmentId,
                                       }: AssignmentDeadlineFormProps) => {
    const [isEditing, setEditing] = useState(false);
    const [date, setDate] = useState<Date | undefined>(new Date(initialData.deadline.toString()));

    const toggleEditing = () => setEditing((current) => !current);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            deadline: date,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const handleDateChange = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (selectedDate) {
            form.setValue("deadline", selectedDate);
        } else {
            form.setValue("deadline", undefined);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}`, values);
            toast.success("Дані оновлено успішно.");
            toggleEditing();
            router.refresh();
        } catch (e) {
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
            console.error(e);
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Граничний термін здачі
                <Button onClick={toggleEditing} variant="ghost">
                    {isEditing ? (
                        <>Скасувати</>
                    ) : (
                        <>
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Змінити термін
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2">
                    {date ? format(date, "PPP", { locale: uk }) : "Дата не вказана"}
                </p>
            )}
            {isEditing && (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {date ? format(date, "PPP", { locale: uk }) : <span>Оберіть дату</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={handleDateChange}
                                    locale={uk}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Button
                            disabled={!isValid || isSubmitting || !date}
                            type="submit"
                        >
                            Зберегти зміни
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AssignmentDeadlineForm;