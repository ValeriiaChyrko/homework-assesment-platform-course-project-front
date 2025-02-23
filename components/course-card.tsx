import Link from "next/link";
import Image from "next/image";
import {IconBadge} from "@/components/icon-badge";
import {BookOpen} from "lucide-react";

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    progress: number | null;
    category: string;
}

export const CourseCard = ({
    id,
    title,
    imageUrl,
    chaptersLength,
    progress,
    category,
}: CourseCardProps) => {
    let chapterText;
    if (chaptersLength % 10 === 1 && chaptersLength % 100 !== 11) {
        chapterText = "Розділ";
    } else if (chaptersLength % 10 >= 2 && chaptersLength % 10 <= 4 && (chaptersLength % 100 < 10 || chaptersLength % 100 >= 20)) {
        chapterText = "Розділи";
    } else {
        chapterText = "Розділів";
    }

    return (
        <Link href={`/courses/${id}`} >
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        fill
                        className="object-cover"
                        src={imageUrl}
                        alt={title}
                    />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {category}
                    </p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text:xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge size="sm" icon={BookOpen} />
                            <span>
                                {chaptersLength} {chapterText}
                            </span>
                        </div>
                    </div>
                    {progress !== 0 && (
                        <div>{/*TODO: Progress component*/}</div>
                    )}
                </div>
            </div>
        </Link>
    )
}