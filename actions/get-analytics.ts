import { Enrollment, Course } from "@prisma/client";
import {db} from "@/lib/db";

type EnrolledWithCourse = Enrollment & {
    course: Course;
};

const groupByCourse = (enrollments: EnrolledWithCourse[]) => {
    const grouped: { [courseTitle: string]: number} = {};

    enrollments.forEach((enrollment) => {
        const courseTitle = enrollment.course.title;

        if (!grouped[courseTitle]) {
            grouped[courseTitle] = 0;
        }
        grouped[courseTitle] += 1;
    })

    return grouped;
};

export const getAnalytics = async (userId: string) => {
    try{
        const enrollments = await db.enrollment.findMany({
            where: {
                course: {
                    userId: userId
                }
            },
            include: {
                course: true,
            }
        });

        const groupedStudents = groupByCourse(enrollments);
        const data = Object.entries(groupedStudents).map(([courseTitle, total]) => ({
            name: courseTitle,
            total: total,
        }));

        const totalStudents = enrollments.length;

        return {
            data,
            totalStudents
        }
    } catch (e) {
        console.error("GET_ANALYTICS", e);
        return {
            data: [],
            totalStudents: 0,
        };
    }
}