import {cva, VariantProps} from "class-variance-authority";
import {AlertTriangle, CheckCircleIcon} from "lucide-react";
import {cn} from "@/lib/utils";

const bannerVariants = cva(
    "border text-center p-4 text-sm flex items-center w-full",
    {
        variants: {
            variant: {
                warning: "bg-yellow-200/30 border-yellow-100 text-primary",
                success: "bg-emerald-700 border-emerald-700 text-secondary"
            }
        },
        defaultVariants: {
            variant: "warning",
        }
    }
);

interface BannerProps extends VariantProps<typeof bannerVariants>{
    label: string;
}

const iconMap = {
    warning: AlertTriangle,
    success: CheckCircleIcon,
}

export const Banner = ({
    label,
    variant,
}: BannerProps) => {
    const Icon = iconMap[variant || "warning"];

    return (
        <div className={cn(bannerVariants({variant}))}>
            <Icon className="h-4 w-4 mr-2" />
            {label}
        </div>
    )
}