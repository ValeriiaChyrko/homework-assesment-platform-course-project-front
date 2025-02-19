import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle
} from "@/components/ui/sheet";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {Sidebar} from "./sidebar";

export const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white">
                <VisuallyHidden>
                    <SheetTitle>Navigation</SheetTitle>
                </VisuallyHidden>
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
};
