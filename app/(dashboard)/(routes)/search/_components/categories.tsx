"use client"

import {Category} from "@prisma/client";

import {
    FcCommandLine,
    FcGlobe,
    FcSmartphoneTablet,
    FcSelfie,
    FcDataConfiguration,
    FcMindMap,
    FcDataProtection,
    FcProcess,
    FcParallelTasks
} from "react-icons/fc";
import {IconType} from "react-icons";
import {CategoryItem} from "@/app/(dashboard)/(routes)/search/_components/category-item";

interface CategorisProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Розробка програмного забезпечення": FcCommandLine,
    "Розробка веб-додатків": FcGlobe,
    "Мобільна розробка": FcSmartphoneTablet,
    "Розробка ігор": FcSelfie,
    "Наука про дані": FcDataConfiguration,
    "Машинне навчання": FcMindMap,
    "Кібербезпека": FcDataProtection,
    "DevOps": FcProcess,
    "Архітектура програмного забезпечення": FcParallelTasks
};

export const Categories = ({
    items,
}: CategorisProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2 scroll-container">
            {items.map((category) => (
                <CategoryItem
                    key={category.id}
                    label={category.name}
                    icon={iconMap[category.name]}
                    value={category.id}
                />
            ))}
        </div>
    )
}