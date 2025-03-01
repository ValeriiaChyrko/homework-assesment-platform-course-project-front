﻿import {db} from "@/lib/db";
import {getProgress} from "@/actions/get-progress";
import {Category, Chapter, Course} from "@prisma/client";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: Chapter[];
    progress: number | null;
};

type DashboardCourses = {
    completedCourses: any[];
    coursesInProgress: any[];
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
    try{
        const enrolledCourses = await db.enrollment.findMany({
            where: {
                userId: userId
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true
                            }
                        }
                    }
                }
            }
        });

        const courses = enrolledCourses.map((enrollment) =>
            enrollment.course) as CourseWithProgressWithCategory[];

        for (let course of courses) {
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress;
        }

        const completedCourses = courses.filter((course) => course.progress === 100);
        const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

        return {
            completedCourses,
            coursesInProgress,
        };
    } catch (e){
        console.error("GET_DASHBOARD_COUSES", e);
        return {
            completedCourses: [],
            coursesInProgress: []
        };
    }
}