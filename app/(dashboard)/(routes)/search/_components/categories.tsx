"use client"

import {Category} from "@prisma/client";

import {
    FcWorkflow,
    FcGlobe,
    FcSmartphoneTablet,
    FcElectronics,
    FcDataConfiguration,
    FcMindMap,
    FcLock,
    FcProcess,
    FcEngineering,
    FcFactory,
    FcParallelTasks
} from "react-icons/fc";
import {IconType} from "react-icons";
import {CategoryItem} from "@/app/(dashboard)/(routes)/search/_components/category-item";

interface CategorisProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Розробка програмного забезпечення": FcWorkflow,
    "Розробка веб-додатків": FcGlobe,
    "Мобільна розробка": FcSmartphoneTablet,
    "Розробка ігор": FcElectronics,
    "Наука про дані": FcDataConfiguration,
    "Машинне навчання": FcMindMap,
    "Кібербезпека": FcLock,
    "DevOps": FcProcess,
    "Вбудовані системи": FcEngineering,
    "Хмарні обчислення": FcFactory,
    "Архітектура програмного забезпечення": FcParallelTasks
};

export const Categories = ({
    items,
}: CategorisProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
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