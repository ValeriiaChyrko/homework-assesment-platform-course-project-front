import {DataTable} from "@/app/(dashboard)/(routes)/teacher/courses/_components/data-table";
import {columns} from "./_components/columns"
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";

const CoursesPage = async () => {
    const {userId} = await auth();
    if (!userId) {
        redirect("/")
    }

    const courses = await db.course.findMany({
        where: {
            userId: userId
        },
        include: {
            category: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="p-6">
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={courses} />
            </div>
        </div>
    )
}

export default CoursesPage