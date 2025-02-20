"use client"

import * as z from "zod";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {
    Form,
    FormControl, FormDescription,
    FormField, FormItem, FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {PencilIcon} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";

interface DescriptionFormProps {
    initialData: {
        description: string | null;
    };
    courseId: string;
};

const formSchema = z.object({
    description: z.string().min(1, {
        message: "Необхідно вказати опис.",
    }),
});

export const DescriptionForm = ({
    initialData,
    courseId
}: DescriptionFormProps) => {
    const [isEditing, setEditing] = useState(false);

    const toggleEditing = () => setEditing((current) => !current);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData.description || '',
        }
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const response = await axios.patch(`/api/courses/${courseId}`, values);
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
                Опис курсу
                <Button onClick={toggleEditing} variant="ghost">
                    {isEditing ? (
                        <>Скасувати</>
                    ) : (
                        <>
                            <PencilIcon className="h-4 w-4 mr-1"/>
                            Змінити опис
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.description && "text-slate-500 italic"
                )}>
                    {initialData.description || "Без опису"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="Наприклад, 'Цей курс орієнтований на...'"
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

export default DescriptionForm;