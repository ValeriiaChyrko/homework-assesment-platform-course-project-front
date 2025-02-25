"use client"

import * as z from "zod";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {
    Form,
    FormControl, FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

import {Button} from "@/components/ui/button";
import {PencilIcon, SquareCheck, SquareX} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {Assignment} from "@prisma/client";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";

interface ChapterDescriptionFormProps {
    initialData: Assignment;
    courseId: string;
    chapterId: string;
    assignmentId: string;
}

const formSchema = z.object({
    maxScore: z.number().positive("Число повинно бути більше 0"),
    maxAttemptsAmount: z.number().min(1, "Число повинно бути більше 1"),

    attemptCompilationSectionEnable: z.boolean().default(false),
    attemptTestsSectionEnable: z.boolean().default(false),
    attemptQualitySectionEnable: z.boolean().default(false),

    attemptCompilationMaxScore: z.number().positive("Число повинно бути більше 0"),
    attemptCompilationMinScore: z.number().nonnegative("Число повинно бути більше 0"),

    attemptTestsMaxScore: z.number().positive("Число повинно бути більше 0"),
    attemptTestsMinScore: z.number().nonnegative("Число повинно бути більше 0"),

    attemptQualityMaxScore: z.number().positive("Число повинно бути більше 0"),
    attemptQualityMinScore: z.number().nonnegative("Число повинно бути більше 0"),
});

export const AssignmentTestCriteriaForm = ({
    initialData,
    courseId,
    chapterId,
    assignmentId
}: ChapterDescriptionFormProps) => {
    const [isEditing, setEditing] = useState(false);

    const toggleEditing = () => setEditing((current) => !current);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            maxScore: initialData.maxScore,
            maxAttemptsAmount: initialData.maxAttemptsAmount,
            attemptCompilationSectionEnable: initialData.attemptCompilationSectionEnable,
            attemptTestsSectionEnable: initialData.attemptTestsSectionEnable,
            attemptQualitySectionEnable: initialData.attemptQualitySectionEnable,
        },
        mode: "onChange",
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
                Параметри тестування
                <Button onClick={toggleEditing} variant="ghost">
                    {isEditing ? (
                        <>Скасувати</>
                    ) : (
                        <>
                            <PencilIcon className="h-4 w-4 mr-1"/>
                            Змінити параметри
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className="text-sm mt-2 space-y-4">
                    {/* Section 1 */}
                    <div className="p-y-4">
                        <div>
                            <span className="text-slate-700">Максимальний бал:</span>
                            {initialData.maxScore ? (
                                <span className="font-semibold text-slate-700 ml-2">{initialData.maxScore}</span>
                            ) : (
                                <span className="text-slate-500 italic">100</span>
                            )}
                        </div>
                        <div>
                            <span className="text-slate-700">Кількість спроб:</span>
                            {initialData.maxAttemptsAmount ? (
                                <span className="font-semibold text-slate-700 ml-2">{initialData.maxAttemptsAmount}</span>
                            ) : (
                                <span className="text-slate-500 italic">5</span>
                            )}
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="p-4 bg-white shadow rounded-lg space-y-2">
                        <div className={cn("text-slate-700", !initialData.attemptCompilationSectionEnable && "text-slate-500 italic")}>
                            {initialData.attemptCompilationSectionEnable ? (
                                <div className="flex items-center">
                                    <SquareCheck className="h-4 w-4 mr-2"/>
                                    Рішення доступне для перервірки на компіляцію.
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <SquareX className="h-4 w-4 mr-2"/>
                                    Рішення не буде проходити перервірку на компіляцію.
                                </div>
                            )}
                        </div>
                        {initialData.attemptCompilationSectionEnable && (
                            <div className="flex justify-between">
                                <div>
                                    <span className="font-medium">Максимальний бал:</span>
                                    {initialData.attemptCompilationMaxScore ? (
                                        <span className="font-semibold text-slate-700 ml-2">{initialData.attemptCompilationMaxScore}</span>
                                    ) : (
                                        <span className="font-semibold">100</span>
                                    )}
                                </div>
                                <div>
                                    <span className="font-medium">Мінімальний бал:</span>
                                    {initialData.attemptCompilationMinScore ? (
                                        <span className="font-semibold text-slate-700 ml-2">{initialData.attemptCompilationMinScore}</span>
                                    ) : (
                                        <span className="font-semibold ml-2">0</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 3 */}
                    <div className="p-4 bg-white shadow rounded-lg space-y-2">
                        <div className={cn("text-slate-700", !initialData.attemptTestsSectionEnable && "text-slate-500 italic")}>
                            {initialData.attemptTestsSectionEnable ? (
                                <div className="flex items-center">
                                    <SquareCheck className="h-4 w-4 mr-2"/>
                                    Рішення доступне для перервірки на відповідність тестів.
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <SquareX className="h-4 w-4 mr-2"/>
                                    Рішення не буде проходити перервірку на відповідність тестів.
                                </div>
                            )}
                        </div>
                        {initialData.attemptTestsSectionEnable && (
                            <div className="flex justify-between">
                                <div>
                                    <span className="font-medium">Максимальний бал:</span>
                                    {initialData.attemptTestsMaxScore ? (
                                        <span className="font-semibold text-slate-700 ml-2">{initialData.attemptTestsMaxScore}</span>
                                    ) : (
                                        <span className="font-semibold">100</span>
                                    )}
                                </div>
                                <div>
                                    <span className="font-medium">Мінімальний бал:</span>
                                    {initialData.attemptTestsMinScore ? (
                                        <span className="font-semibold text-slate-700 ml-2">{initialData.attemptTestsMinScore}</span>
                                    ) : (
                                        <span className="font-semibold ml-2">0</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section  4 */}
                    <div className="p-4 bg-white shadow rounded-lg space-y-2">
                        <div className={cn("text-slate-700", !initialData.attemptQualitySectionEnable && "text-slate-500 italic")}>
                            {initialData.attemptQualitySectionEnable ? (
                                <div className="flex items-center">
                                    <SquareCheck className="h-4 w-4 mr-2"/>
                                    Рішення доступний для перервірки коду на якість.
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <SquareX className="h-4 w-4 mr-2"/>
                                    Рішення не буде проходити перервірку коду на якість.
                                </div>
                            )}
                        </div>
                        {initialData.attemptQualitySectionEnable && (
                            <div className="flex justify-between">
                                <div>
                                    <span className="font-medium">Максимальний бал:</span>
                                    {initialData.attemptQualityMaxScore ? (
                                        <span className="font-semibold text-slate-700 ml-2">{initialData.attemptQualityMaxScore}</span>
                                    ) : (
                                        <span className="font-semibold">100</span>
                                    )}
                                </div>
                                <div>
                                    <span className="font-medium">Мінімальний бал:</span>
                                    {initialData.attemptQualityMinScore ? (
                                        <span className="font-semibold text-slate-700 ml-2">{initialData.attemptQualityMinScore}</span>
                                    ) : (
                                        <span className="font-semibold ml-2">0</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-2 mt-4"
                    >
                        <Label htmlFor="maxScore" className="text-sm text-slate-500">Максимальний бал:</Label>
                        <FormField
                            control={form.control}
                            name="maxScore"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isSubmitting}
                                            placeholder="Введіть ціле число, що перевищує 0"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value ? parseFloat(value) : 0);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Label htmlFor="maxAttemptsAmount" className="text-sm text-slate-500">Кількість спроб:</Label>
                        <FormField
                            control={form.control}
                            name="maxAttemptsAmount"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isSubmitting}
                                            placeholder="Введіть ціле число, що перевищує 1"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value ? parseFloat(value) : 0);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="attemptCompilationSectionEnable"
                            render={({field}) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="mt-1"
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormDescription>
                                            Оберіть цю опцію, щоб дозволити перевірку рішення на компіляцію.
                                        </FormDescription>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Label htmlFor="attemptCompilationMaxScore" className="text-sm text-slate-500">Максимальний бал:</Label>
                        <FormField
                            control={form.control}
                            name="attemptCompilationMaxScore"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isSubmitting}
                                            placeholder="Введіть ціле число, що перевищує 0"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value ? parseFloat(value) : 0);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Label htmlFor="attemptCompilationMinScore" className="text-sm text-slate-500">Мінімальний бал:</Label>
                        <FormField
                            control={form.control}
                            name="attemptCompilationMinScore"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isSubmitting}
                                            placeholder="Введіть ціле число, що перевищує 0"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value ? parseFloat(value) : 0);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="attemptTestsSectionEnable"
                            render={({field}) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="mt-1"
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormDescription>
                                            Оберіть цю опцію, щоб дозволити перевірку рішення на відповідність тестів.
                                        </FormDescription>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Label htmlFor="attemptTestsMaxScore" className="text-sm text-slate-500">Максимальний бал:</Label>
                        <FormField
                            control={form.control}
                            name="attemptTestsMaxScore"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isSubmitting}
                                            placeholder="Введіть ціле число, що перевищує 0"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value ? parseFloat(value) : 0);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Label htmlFor="attemptTestsMinScore" className="text-sm text-slate-500">Мінімальний бал:</Label>
                        <FormField
                            control={form.control}
                            name="attemptTestsMinScore"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isSubmitting}
                                            placeholder="Введіть ціле число, що перевищує 0"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value ? parseFloat(value) : 0);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="attemptQualitySectionEnable"
                            render={({field}) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="mt-1"
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormDescription>
                                            Оберіть цю опцію, щоб дозволити перевірку коду на якість.
                                        </FormDescription>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Label htmlFor="attemptQualityMaxScore" className="text-sm text-slate-500">Максимальний бал:</Label>
                        <FormField
                            control={form.control}
                            name="attemptQualityMaxScore"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isSubmitting}
                                            placeholder="Введіть ціле число, що перевищує 0"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value ? parseFloat(value) : 0);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Label htmlFor="attemptQualityMinScore" className="text-sm text-slate-500">Мінімальний бал:</Label>
                        <FormField
                            control={form.control}
                            name="attemptQualityMinScore"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isSubmitting}
                                            placeholder="Введіть ціле число, що перевищує 0"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value ? parseFloat(value) : 0);
                                            }}
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
                                className={cn("mt-4")}
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

export default AssignmentTestCriteriaForm;