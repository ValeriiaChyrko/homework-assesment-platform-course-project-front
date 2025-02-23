import {db} from "@/lib/db";
import {Categories} from "@/app/(dashboard)/(routes)/search/_components/categories";
import {SearchInput} from "@/components/search-input";
import {getCourses} from "@/actions/get-courses";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {CoursesList} from "@/components/couses-list";

interface SearchPageProps {
    searchParams: {
        title: string;
        categoryUd: string;
    }
}

const SearchPage = async ({
    searchParams
}: SearchPageProps) => {
    const {userId} = await auth();

    if (!userId) {
        redirect("/");
    }

    const categories = await db.category.findMany( {
        orderBy: {
            name: "asc"
        }
    });

    const courses = await getCourses({
        userId: userId,
        ...searchParams
    });

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6 space-y-6">
                <Categories
                    items={categories}
                />
                <CoursesList
                    items={courses}
                />
            </div>
        </>
    )
}

export default SearchPage;