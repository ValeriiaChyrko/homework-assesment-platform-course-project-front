"use client"

import {Assignment} from "@prisma/client";
import {useEffect, useState} from "react";

import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from "@hello-pangea/dnd";

import {cn} from "@/lib/utils";
import {Grip, PencilIcon} from "lucide-react";
import {Badge} from "@/components/ui/badge";

interface AssignmentListProps {
    items: Assignment[];
    onReorder: (updateData: { id: string; position: number}[]) => void;
    onEdit: (id: string) => void;
}

export const AssignmentList = ({
    items,
    onReorder,
    onEdit
}: AssignmentListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [assignments, setAssignments] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setAssignments(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(assignments);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updatedAssignments = items.slice(startIndex, endIndex + 1);
        setAssignments(items);

        const bulkUpdatedData = updatedAssignments.map((chapter) => ({
            id: chapter.id,
            position: items.findIndex((item) => item.id === chapter.id),
        }))

        onReorder(bulkUpdatedData);
    }

    if (!isMounted) {
        return null;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {provided => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {assignments.map((assignment, index) => (
                            <Draggable
                                key={assignment.id}
                                draggableId={assignment.id}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        className={cn(
                                            "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                                            assignment.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                                        )}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <div
                                            className={cn(
                                                "px-2 py-2 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                                assignment.isPublished && "border-r-sky-200 hover:bg-sky-200"
                                            )}
                                            {...provided.dragHandleProps}
                                        >
                                            <Grip
                                                className="h-5 w-5"
                                            />
                                        </div>
                                        {assignment.title}
                                        <div
                                            className="ml-auto pr-2 flex items-center gap-x-2"
                                        >
                                            <Badge
                                                className={cn(
                                                    "bg-slate-500 pb-1",
                                                    assignment.isPublished && "bg-sky-700"
                                                )}
                                            >
                                                {assignment.isPublished ? "Опублікований" : "Чернетка"}
                                            </Badge>
                                            <PencilIcon
                                                onClick={() => onEdit(assignment.id)}
                                                className="w-4 h-4 cursor-pointer hover:opacity-75"
                                            />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}