"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Course} from "@prisma/client";
import {ArrowUpDown, Menu, MoreHorizontal, PencilIcon} from "lucide-react";
import {Button} from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";

export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "title",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Назва курсу
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "isPublished",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Статус публікації
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ getValue }) => {
            const status = getValue<boolean>() || false;
            return (
                <Badge className={cn(
                    "bg-slate-500/90 pb-1",
                    status && "bg-sky-700/90"
                )}>
                    {status ? "Доступний для студентів" : "Прихований"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "category.name",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Категорія
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        id: "actions",
        cell: ({row}) => {
            const {id} = row.original;

            return(
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-4 w-auto p-0 flex items-center">
                            <span className="hidden lg:flex items-center">
                                <Menu className="mr-2 h-4 w-4" />
                                Меню параметрів
                            </span>
                            <MoreHorizontal className="block h-4 w-4 lg:hidden" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Link href={`/teacher/courses/${id}`}>
                            <DropdownMenuItem>
                                <PencilIcon className="h-4 w-4 mr-2"/>
                                Редагувати
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]