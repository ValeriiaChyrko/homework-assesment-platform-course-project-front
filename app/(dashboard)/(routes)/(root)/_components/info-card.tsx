import { IconBadge } from "@/components/icon-badge"
import {LucideIcon} from "lucide-react";

interface InfoCardProps {
    numbersOfItems: number,
    variant? : "default" | "success",
    label: string,
    icon: LucideIcon
}

export const InfoCard = ({
    variant,
    icon: Icon,
    numbersOfItems,
    label,
}: InfoCardProps) => {
    let courseText;
    if (numbersOfItems % 10 === 1 && numbersOfItems % 100 !== 11) {
        courseText = "Курс";
    } else if (numbersOfItems % 10 >= 2 && numbersOfItems % 10 <= 4 && (numbersOfItems % 100 < 10 || numbersOfItems % 100 >= 20)) {
        courseText = "Курси";
    } else {
        courseText = "Курсів";
    }

    return (
        <div className="border rounded-md flex items-center gap-x-2 p-3">
            <IconBadge
                variant={variant}
                icon={Icon}
            />
            <div>
                <p className="font-medium">
                    {label}
                </p>
                <p className="text-gray-500 text-sm">
                    {numbersOfItems} {courseText}
                </p>
            </div>
        </div>
    )
}